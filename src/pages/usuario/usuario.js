import { BasicModal } from '@/layouts'
import { Confirm, Loading, Title, UploadImg } from '@/components/Layouts'
import { useAuth } from '@/contexts/AuthContext'
import { FaCheck, FaEdit, FaImage, FaMoon, FaSun, FaTimes, FaUser } from 'react-icons/fa'
import { Button, Image } from 'semantic-ui-react'
import { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { ModCuentaForm, UsuarioAddDatosImage, UsuarioFormEditPDF, UsuarioFormPDF } from '@/components/Usuario'
import { BiSolidToggleLeft, BiSolidToggleRight } from 'react-icons/bi'
import styles from './usuario.module.css'
import { getValueOrDefault } from '@/helpers'
import { useTheme } from '@/contexts/ThemeContext'
import axios from 'axios'

export default function Usuario() {

  const { user, logout, loading } = useAuth()

  const { theme, toggleTheme } = useTheme()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [show, setShow] = useState(false)

  const onOpenClose = () => setShow((prevState) => !prevState)

  const [showFormPDF, setShowFormPDF] = useState(false)

  const onOpenCloseFormPDF = () => setShowFormPDF((prevState) => !prevState)

  const [showEditPDF, setShowEditPDF] = useState(false)

  const onOpenCloseEditPDF = () => setShowEditPDF((prevState) => !prevState)

  const [datoPDF, setDatoPDF] = useState(null)

  useEffect(() => {
    if (user && user.id) {
      (async () => {
        try {
          const res = await axios.get(`/api/usuarios/datos_pdf?usuario_id=${user.id}`)
          setDatoPDF(res.data)
        } catch (error) {
          console.error(error)
        }
      })()
    }
  }, [reload, user])

  const [showSubirImg, setShowSubirImg] = useState(false)

  const onShowSubirImg = () => {
    setShowSubirImg(true)
  }

  const onCloseSubirImg = () => {
    setShowSubirImg(false)
  }

  const [showConfirmDelImg, setShowConfirmDelImg] = useState(false)
  const onShowConfirmDelImg = () => setShowConfirmDelImg(true)

  const [imgKeyToDelete, setImgKeyToDelete] = useState(null)

  const setImageToDelete = () => {
    if (datoPDF?.logo) {
      setImgKeyToDelete('logo')
    }
  }

  const handleDeleteImage = async () => {
    try {
      await axios.delete(`/api/usuarios/uploadImage`, {
        params: {
          id: datoPDF.id,
          imageKey: imgKeyToDelete,
        },
      })

      setDatoPDF((prevDatoPDF) => ({
        ...prevDatoPDF,
        [imgKeyToDelete]: null,
      }))

      onReload()
      //setShowImg(false)
      setShowConfirmDelImg(false)
    } catch (error) {
      console.error('Error al eliminar la imagen:', error)
    }
  }

  const [activeToggleBan, setActiveToggleBan] = useState(1);
  const [activeToggle, setActiveToggle] = useState(1);

  // Usamos `useEffect` para manejar el acceso a localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Si estamos en el navegador, accedemos a localStorage
      const savedToggle = localStorage.getItem('activeToggle');
      if (savedToggle) {
        setActiveToggle(parseInt(savedToggle));
      }

      const savedToggleBan = localStorage.getItem('activeToggleBan');
      if (savedToggleBan) {
        setActiveToggleBan(parseInt(savedToggleBan));
      }
    }
  }, []);

  // Guardamos el estado del toggle cuando cambie
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeToggleBan', activeToggleBan);
      localStorage.setItem('activeToggle', activeToggle);
    }
  }, [activeToggle, activeToggleBan]);

  const onToggleBan = (index) => {
    setActiveToggleBan(index);
  }

  const onToggle = (index) => {
    setActiveToggle(index);
  }

  if (loading) {
    <Loading size={45} loading={'L'} />
  }

  return (

    <ProtectedRoute>

      <Title title='Usuario' iconBack />

      <div className={styles.main}>
        <div className={styles.section}>
          <FaUser />

          <div className={styles.datos_usuario}>
            {user && user.usuario &&
              <>
                <h1>{user.usuario}</h1>
                <div>
                  <h2>Nombre:</h2>
                  <h3>{user.nombre}</h3>
                </div>
                <div>
                  <h2>Correo:</h2>
                  <h3>{user.email}</h3>
                </div>
                <div>
                  <h2>Nivel:</h2>
                  <h3>{user.nivel}</h3>
                </div>
                <div>
                  <h2>Folios:</h2>
                  <h3>{user.folios}</h3>
                </div>
              </>
            }
          </div>

          <div className={styles.iconEdit}>
            <div onClick={onOpenClose}>
              <FaEdit />
            </div>
          </div>

          <div className={styles.datos_pdf}>
            <h1>Datos de mi negocio</h1>
            <div className={styles.datos}>
              <div>
                <h1>Nombre de mi negocio</h1>
                <h2>{getValueOrDefault(datoPDF?.fila1)}</h2>
              </div>
              <div>
                <h1>Calle / Número</h1>
                <h2>{getValueOrDefault(datoPDF?.fila2)}</h2>
              </div>
              <div>
                <h1>Colonia</h1>
                <h2>{getValueOrDefault(datoPDF?.fila3)}</h2>
              </div>
              <div>
                <h1>Código postal</h1>
                <h2>{getValueOrDefault(datoPDF?.fila4)}</h2>
              </div>
              <div>
                <h1>Ciudad / Estado</h1>
                <h2>{getValueOrDefault(datoPDF?.fila5)}</h2>
              </div>
              <div>
                <h1>Teléfono</h1>
                <h2>{getValueOrDefault(datoPDF?.fila7)}</h2>
              </div>
              <div>
                <h1>Logo</h1>
                {!datoPDF?.logo ? (
                  <FaImage onClick={() => onShowSubirImg()} />
                ) : (
                  <Image
                    src={datoPDF.logo}
                    onClick={() => {
                      setImageToDelete()
                      onShowConfirmDelImg()
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          <div className={styles.iconEdit}>
            <div onClick={onOpenCloseFormPDF}>
              <FaEdit />
            </div>
          </div>

          <div className={styles.toggleMain}>
            <h1>Selecciona la combinación de colores de la nota</h1>
            <div>
              <h2>Encabezado</h2>
              {[
                { id: 1, label: "Blanco", onClass: styles.toggleClr1ONBan },
                { id: 2, label: "Gris", onClass: styles.toggleClr2ONBan },
              ].map(({ id, label, onClass }) => (
                <div key={id}>
                  <h3>{label}</h3>
                  <div
                    className={activeToggleBan === id ? onClass : styles.toggleClrOFF}
                    onClick={() => onToggleBan(id)}
                  >
                    {activeToggleBan === id ? <BiSolidToggleRight /> : <BiSolidToggleLeft />}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <h2>Datos generales</h2>
              {[
                { id: 1, label: "Gris / Negro", onClass: styles.toggleClr1ON },
                { id: 2, label: "Gris / Azul", onClass: styles.toggleClr2ON },
                { id: 3, label: "Gris / Verde", onClass: styles.toggleClr3ON },
                { id: 4, label: "Gris / Rojo", onClass: styles.toggleClr4ON },
                { id: 5, label: "Gris / Naranja", onClass: styles.toggleClr5ON }
              ].map(({ id, label, onClass }) => (
                <div key={id}>
                  <h3>{label}</h3>
                  <div
                    className={activeToggle === id ? onClass : styles.toggleClrOFF}
                    onClick={() => onToggle(id)}
                  >
                    {activeToggle === id ? <BiSolidToggleRight /> : <BiSolidToggleLeft />}
                  </div>
                </div>
              ))}
            </div>

          </div>
          
          <div className={styles.toggleTheme}>
            {theme != 'dark' ?
              <div>
                <h1>Modo claro</h1>
                <BiSolidToggleLeft onClick={toggleTheme} />
              </div> : 
              <div className={styles.toggleMoon}>
                <h1>Modo oscuro</h1>
                <BiSolidToggleRight onClick={toggleTheme} />
              </div>
            }
            {theme != 'dark' ?
              <div className={styles.iconThemeSun}>
                <FaSun onClick={toggleTheme} />
              </div> :
              <div className={styles.iconThemeMoon}>
                <FaMoon onClick={toggleTheme} />
              </div>
            }
          </div>

          

          <Button negative onClick={logout}>
            Cerrar sesión
          </Button>

          <div className={styles.footer}>
            <div>
              <h1>© 2025 NotaSmart</h1>
            </div>
          </div>

        </div>

      </div>


      <BasicModal title='modificar usuario' show={show} onClose={onOpenClose}>
        <ModCuentaForm onOpenClose={onOpenClose} />
      </BasicModal>

      <BasicModal title={datoPDF ? 'editar negocio' : 'crear negocio'} show={showFormPDF} onClose={onOpenCloseEditPDF}>
        {datoPDF ? (
          <UsuarioFormEditPDF reload={reload} onReload={onReload} datoPDF={datoPDF} onOpenCloseFormPDF={onOpenCloseFormPDF} />
        ) : (
          <UsuarioFormPDF reload={reload} onReload={onReload} user={user} onOpenCloseFormPDF={onOpenCloseFormPDF} />
        )}
      </BasicModal>

      <BasicModal title="Subir imagen" show={showSubirImg} onClose={onCloseSubirImg}>
        {datoPDF ?
          <UploadImg
            reload={reload}
            onReload={onReload}
            itemId={datoPDF.id}
            endpoint="usuarios"
            onShowSubirImg={onCloseSubirImg}
            onSuccess={(key, url) => {
              setDatoPDF({ ...datoPDF, logo: url })
              onCloseSubirImg()
            }}
            selectedImageKey="logo"
          /> :
          <UsuarioAddDatosImage onCloseSubirImg={onCloseSubirImg} />
        }
      </BasicModal>

      <Confirm
        open={showConfirmDelImg}
        onConfirm={handleDeleteImage}
        onCancel={() => setShowConfirmDelImg(false)}
        content="¿Estás seguro de eliminar el logo?"
      />

    </ProtectedRoute>

  )
}
