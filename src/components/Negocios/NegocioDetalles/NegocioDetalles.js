import { IconClose, Confirm, IconDel, IconEdit } from '@/components/Layouts'
import { useEffect, useMemo, useState } from 'react'
import { BasicModal } from '@/layouts'
import { NegocioEditForm } from '../NegocioEditForm'
import { useAuth } from '@/contexts/AuthContext'
import axios from 'axios'
import { getValueOrDefault } from '@/helpers'
import styles from './NegocioDetalles.module.css'

export function NegocioDetalles(props) {

  const { user, reload, onReload, negocio, onCloseDetalles, onToastSuccess, onToastSuccessMod, onToastSuccessDel } = props

  const [showEdit, setShowEdit] = useState(false)

  const onOpenCloseEdit = () => setShowEdit((prevState) => !prevState)

  const [showConfirmDel, setShowConfirmDel] = useState(false)
  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)

  const handleDeleteCliente = async () => {
    
    if (!negocio?.id) {
      console.error("Negocio o ID no disponible");
      return;
    }

      try {
        await axios.delete(`/api/negocios/negocios?id=${negocio.id}`)
        onReload()
        onToastSuccessDel()
        onCloseDetalles()
      } catch (error) {
        console.error('Error al eliminar el negocio:', error)
      }
  }

  const [negocioData, setNegocioData] = useState(negocio)
  
    useEffect(() => {
      setNegocioData(negocio) 
    }, [negocio]) 
  
    const actualizarNegocio = (nuevaData) => {
      setNegocioData((prevState) => ({
        ...prevState,
        ...nuevaData, 
      }))
    }

    const permissions = useMemo(() =>{

      if(!user) return {}

      return{
        showAdminUsr: user?.id === negocio.usuario_id || user?.nivel === 'admin'
      }

    }, [user])

  return (

    <>

      <IconClose onOpenClose={onCloseDetalles} />

      <div className={styles.section}>
        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Negocio</h1>
              <h2>{getValueOrDefault(negocioData?.negocio)}</h2>
            </div>
            <div>
              <h1>Dirección</h1>
              <h2>{getValueOrDefault(negocioData?.direccion)}</h2>
            </div>
            <div>
              <h1>Email</h1>
              <h2>{getValueOrDefault(negocioData?.email)}</h2>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Folio</h1>
              <h2>{getValueOrDefault(negocioData?.folio)}</h2>
            </div>
            <div>
              <h1>Cel</h1>
              <h2>{getValueOrDefault(negocioData?.cel)}</h2>
            </div>
          </div>
        </div>

        <IconEdit onOpenEdit={onOpenCloseEdit} />

        {permissions.showAdminUsr &&
          <>
            <IconDel setShowConfirmDel={onOpenCloseConfirmDel} />
          </>
        }

      </div>

      <BasicModal title='modificar negocio' show={showEdit} onClose={onOpenCloseEdit}>
        <NegocioEditForm reload={reload} onReload={onReload} negocioData={negocioData} actualizarNegocio={actualizarNegocio} onOpenCloseEdit={onOpenCloseEdit} onToastSuccess={onToastSuccess} onToastSuccessMod={onToastSuccessMod} />
      </BasicModal>

      <Confirm
        open={showConfirmDel}
        onConfirm={handleDeleteCliente}
        onCancel={onOpenCloseConfirmDel}
        content='¿ Estas seguro de eliminar el negocio ?'
      />

    </>

  )
}
