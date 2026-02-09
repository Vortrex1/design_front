import React from 'react'
import Backdrop from '@mui/material/Backdrop'
import { useSelector } from 'react-redux'
import { Blocks } from 'react-loader-spinner'

const Loader = () => {
  const { apiRequestIsLoading: pageIsLoading } = useSelector(
    (store) => store.appSettings
  )

  return (
    <>
      <div>
        {pageIsLoading && (
          <Backdrop
            sx={(theme) => ({
              color: '#fff',
              zIndex: theme.zIndex.drawer + 1,
            })}
            open={pageIsLoading}
          >
            <Blocks
              height="80"
              width="80"
              color="#4fa94d"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              visible={true}
            />
          </Backdrop>
        )}
      </div>
    </>
  )
}
export default Loader
