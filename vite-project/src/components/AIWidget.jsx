import React, { useState, useRef, useEffect } from 'react';
import styles from './AIWidget.module.css';
import { ProductService } from '../utils/services/ProductService';
import { ReviewService } from '../utils/services/ReviewService';

const AIWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Ви — помічник CoffeMaker. Допомагайте користувачу вибрати каву за відгуками, рейтингом та описом.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, open]);

  const toggleOpen = () => setOpen((v) => !v);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    const userMsg = { role: 'user', content: text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Attempt to fetch a short product summary from our API to provide context to the model.
      let contextMessage = null;
      try {
        const productsResp = await ProductService.getAll();
        // ProductService.getAll may return an array or an object; normalize
        let items = Array.isArray(productsResp) ? productsResp : (productsResp?.items || productsResp?.products || []);
        items = items || [];
        // Summarize up to 6 products (name, rating, price, short desc)
        const top = items.slice(0, 6);

        // For top few products, fetch sample reviews (limit concurrency)
        const samplePerProduct = 2; // number of sample reviews per product
        const reviewFetchCount = 3; // for first N products fetch review examples
        const reviewPromises = top.slice(0, reviewFetchCount).map(async (p) => {
          try {
            const reviews = await ReviewService.getByProductId(p.id || p.productId || p._id);
            return { id: p.id || p.productId || p._id, reviews: Array.isArray(reviews) ? reviews : (reviews?.items || []) };
          } catch (re) {
            return { id: p.id || p.productId || p._id, reviews: [] };
          }
        });

        const reviewsByProduct = await Promise.all(reviewPromises);
        const reviewsMap = {};
        reviewsByProduct.forEach(r => { reviewsMap[r.id] = r.reviews || []; });

        if (top.length) {
          const list = top.map(p => {
            const id = p.id || p.productId || p._id;
            const name = p.name || p.title || 'Unnamed';
            const rating = p.rating || p.avgRating || p.stars || p.ratingValue || 'N/A';
            const price = (p.price !== undefined && p.price !== null) ? p.price : (p.cost || 'N/A');
            const reviewsCount = p.reviewsCount !== undefined && p.reviewsCount !== null ? p.reviewsCount : (reviewsMap[id] ? reviewsMap[id].length : 'N/A');
            const desc = (p.description || p.shortDescription || '').replace(/\n+/g, ' ').slice(0, 140);
            let line = `- ${name} (rating: ${rating}, price: ${price}, reviews: ${reviewsCount}) ${desc ? ' - ' + desc : ''}`;
            // append sample reviews when available
            const sample = (reviewsMap[id] || []).slice(0, samplePerProduct).map(rv => {
              const rText = (rv.comment || rv.commentText || rv.content || '').replace(/\n+/g, ' ').slice(0, 120);
              const rRating = rv.rating || rv.Rating || 'N/A';
              return `    • ${rRating}★ — ${rText}`;
            }).join('\n');
            if (sample) line += '\n' + sample;
            return line;
          }).join('\n');
          contextMessage = { role: 'system', content: `Product data (use when giving recommendations):\n${list}` };
        }
      } catch (e) {
        console.warn('Failed to load products or reviews for context', e && e.message ? e.message : e);
        contextMessage = null;
      }

      // Compose messages to send: keep original system message at index 0, insert product context after it
      let payloadMessages = [];
      if (messages && messages.length) {
        payloadMessages.push(messages[0]); // original system message
        if (contextMessage) payloadMessages.push(contextMessage);
        // include the rest of conversation (skip original system at index 0)
        payloadMessages = payloadMessages.concat(messages.slice(1));
      }
      // finally add the new user message
      payloadMessages.push(userMsg);

      const res = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      const text = await res.text();
      let data = null;
      try { data = JSON.parse(text); } catch(e) { data = null; }

      if (!res.ok) {
        const backendMsg = data?.error || data?.details || text || 'Network error';
        setMessages((m) => [...m, { role: 'assistant', content: `Виникла помилка при зверненні до сервера: ${backendMsg}` }]);
        return;
      }

      const assistantText = data?.reply || 'Вибачте, нічого не знайдено.';
      setMessages((m) => [...m, { role: 'assistant', content: assistantText }]);
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Виникла помилка при зверненні до сервера.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Render text with simple **bold** parsing and newline preservation.
  // This is intentionally small and safe: React will escape text nodes so we avoid XSS.
  const renderFormatted = (text) => {
    if (!text && text !== 0) return null;
    const parts = [];
    const regex = /\*\*(.+?)\*\*/g; // match **bold**
    let lastIndex = 0;
    let m;
    while ((m = regex.exec(text)) !== null) {
      if (m.index > lastIndex) {
        parts.push({ type: 'text', value: text.slice(lastIndex, m.index) });
      }
      parts.push({ type: 'bold', value: m[1] });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) parts.push({ type: 'text', value: text.slice(lastIndex) });

    // Convert parts into React nodes, preserving newlines
    return parts.map((p, idx) => {
      if (p.type === 'bold') {
        return <strong key={"b_" + idx}>{p.value}</strong>;
      }
      // Split text part by newlines and interleave <br /> nodes
      const lines = String(p.value).split('\n');
      return lines.map((line, i) => (
        // use combined key to keep unique
        <React.Fragment key={"t_" + idx + "_" + i}>
          {line}
          {i < lines.length - 1 ? <br /> : null}
        </React.Fragment>
      ));
    });
  };

  return (
    <div className={styles.wrapper}>
      {open && (
        <div className={styles.panel} role="dialog" aria-label="AI Assistant">
          <div className={styles.header}>
            <strong>AI Помічник</strong>
            <button className={styles.closeBtn} onClick={toggleOpen}>✕</button>
          </div>

          <div className={styles.messages} ref={messagesRef}>
            {messages.slice(1).map((m, i) => (
              <div
                key={i}
                className={`${styles.message} ${m.role === 'user' ? styles.user : styles.assistant}`}
              >
                <div className={styles.messageContent}>{renderFormatted(m.content)}</div>
              </div>
            ))}
            {loading && <div className={styles.message + ' ' + styles.assistant}>Думаю...</div>}
          </div>

          <div className={styles.inputRow}>
            <textarea
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Поставте питання або скажіть яку каву хочете..."
              rows={2}
            />
            <button className={styles.sendBtn} onClick={sendMessage} disabled={loading}>
              Відправити
            </button>
          </div>
        </div>
      )}

      <button aria-label="Open AI assistant" className={styles.fab} onClick={toggleOpen}>
        💬
      </button>
    </div>
  );
};

export default AIWidget;
