import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { router } from './route/router'
import store from './store'
import 'react-quill/dist/quill.snow.css';
import 'react-circular-progressbar/dist/styles.css';
import "react-perfect-scrollbar/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-datetime/css/react-datetime.css";
import NavigationProvider from './contentApi/navigationProvider';
import SideBarToggleProvider from './contentApi/sideBarToggleProvider';
import ThemeCustomizer from './components/shared/ThemeCustomizer';

const App = () => {
  return (
    <>
      <Provider store={store}>
        <NavigationProvider>
          <SideBarToggleProvider>
            <RouterProvider router={router} />
          </SideBarToggleProvider>
        </NavigationProvider>
      </Provider>
      <ThemeCustomizer />
    </>
  )
}

export default App