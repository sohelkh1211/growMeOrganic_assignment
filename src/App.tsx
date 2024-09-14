import { BrowserRouter, Route, Routes } from "react-router-dom"
import ArtworkTable from "./ArtworkTable";
// import 'primereact/resources/themes/saga-blue/theme.css'; // or any other PrimeReact theme
// import 'primereact/resources/primereact.min.css'; // core CSS
// import 'primeicons/primeicons.css'; // icons
import { Toaster } from "react-hot-toast";

function App() {

  return (
    <BrowserRouter>
      <Toaster toastOptions={{
        className: 'font-bold border-[2px]',
        success: {
          duration: 2500,
          iconTheme: {
            primary: 'green',
            secondary: 'black',
          },
          style: {
            color: '#047857',
            borderColor: '#059669',
          },
        },
        error: {
          duration: 2500,
          iconTheme: {
            primary: '#ff4b4b',
            secondary: '#FFFAEE'
          },
          style: {
            color: '#f52f2f',
            borderColor: '#EF4444',
          },
        }
      }}
      />
      <Routes>
        <Route path="/" element={<ArtworkTable />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
