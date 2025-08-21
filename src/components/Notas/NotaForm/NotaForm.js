import { Confirm, ErrorAccesso, IconClose, ToastSuccess } from '@/components/Layouts'
import { Button, Dropdown, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import { formatCurrency, formatDateIncDet, genNVId } from '@/helpers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { FaEdit, FaPlus } from 'react-icons/fa'
import { RowHeadModal } from '../RowHead'
import { ClienteForm } from '@/components/Clientes'
import { BasicModal } from '@/layouts'
import styles from './NotaForm.module.css'
import { ConceptosForm } from '../ConceptosForm'
import { ConceptosEditForm } from '../ConceptosEditForm'
import { AbonosForm } from '../AbonosForm'
import { ProductoBaseForm } from '../ProductoBaseForm'
import { AbonosEditForm } from '../AbonosEditForm'
import { ProductoBaseEditForm } from '../ProductoBaseEditForm'
import { AnticiposForm } from '../AnticiposForm'
import { AnticiposEditForm } from '../AnticiposEditForm'
import { selectClientes } from '@/store/clientes/clienteSelectors'
import { useDispatch, useSelector } from 'react-redux'
import { fetchClientes } from '@/store/clientes/clienteSlice'
import { selectNotaError } from '@/store/notas/notaSelectors'

export function NotaForm(props) {
  const { user, reload, onReload, isAdmin, onOpenCloseForm, onToastSuccess } = props

  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()
  const clientes = useSelector(selectClientes)

  useEffect(() => {
    if (!user) return
    dispatch(fetchClientes(user.negocio_id))
  }, [dispatch, reload, user])

  const [show, setShow] = useState(false)
  const [toastSuccessCliente, setToastSuccessCliente] = useState(false)
  const [cliente_id, setCliente] = useState('')
  const [nota, setNota] = useState('')
  const [forma_pago, setFormaPago] = useState('')
  const [conceptos, setConceptos] = useState([])
  const [nuevoConcepto, setNuevoConcepto] = useState({ tipo: '', concepto: '', precio: '', cantidad: '' })

  const [productoBase, setProductoBase] = useState(null)
  const [abonos, setAbonos] = useState([])
  const [anticipos, setAnticipos] = useState([])
  const [tituloAnticipo, setTituloAnticipo] = useState('Agregar anticipo');

  const [conceptoAEliminar, setConceptoAEliminar] = useState(null)
  const [abonoAEliminar, setAbonoAEliminar] = useState(null)
  const [anticipoAEliminar, setAnticipoAEliminar] = useState(null)

  const [showProductoBaseModal, setShowProductoBaseModal] = useState(false)
  const [showAbonoModal, setShowAbonoModal] = useState(false)
  const [showAnticipoModal, setShowAnticipoModal] = useState(false)
  const tieneProductoBase = conceptos.some(c => c.producto_base === 1)
  const yaTieneAnticipo = anticipos.some(a => a.tipo === 'Anticipo')

  const yaTieneAbonoTipo = abonos.some(a => a.tipo?.toLowerCase() === 'abono')
  const yaTieneAnticipoTipo = anticipos.some(a => a.tipo?.toLowerCase() === 'anticipo')


  const [showEditProductoBase, setShowEditProductoBase] = useState(false);

  const onOpenEditProductoBase = () => {
    setShowEditProductoBase(true);
  };

  const onCloseEditProductoBase = () => {
    setShowEditProductoBase(false);
  }

  const [showConfirmConcepto, setShowConfirmConcepto] = useState(false)
  const [showConfirmAbono, setShowConfirmAbono] = useState(false)
  const [showConfirmAnticipo, setShowConfirmAnticipo] = useState(false)
  const [showConfirmProducto, setShowConfirmProducto] = useState(false)

  const onOpenCloseConfirmProducto = () => {
    setShowConfirmProducto((prev) => !prev);
  }

  const eliminarProducto = () => {
    setProductoBase(null);
    setConceptos((prev) => prev.filter(c => c.producto_base !== 1));
    setShowConfirmProducto(false);
  }

  const [errors, setErrors] = useState({})
  const [showConcep, setShowForm] = useState(false)

  const onOpenCloseClienteForm = () => setShow((prevState) => !prevState)

  const onToastSuccessCliente = () => {
    setToastSuccessCliente(true)
    setTimeout(() => setToastSuccessCliente(false), 3000)
  }

  const onOpenCloseConcep = () => setShowForm((prevState) => !prevState)

  const onOpenCloseConfirm = (index) => {
    setConceptoAEliminar(index)
    setShowConfirmConcepto(true)
  }

  const onOpenCloseConfirmAbono = (index) => {
    setAbonoAEliminar(index)
    setShowConfirmAbono(true)
  }

  const onOpenCloseConfirmAnticipo = (index) => {
    setAnticipoAEliminar(index)
    setShowConfirmAnticipo(true)
  }

  const [showEditConcep, setShowEditConcep] = useState(null)
  const [conceptoEdit, setConceptoEdit] = useState(null)

  const onOpenEditConcep = (index) => {
    setConceptoEdit(conceptos[index])
    setConceptoAEliminar(index)
    setShowEditConcep(true)
  }

  const onCloseEditConcep = () => {
    setConceptoEdit(null)
    setShowEditConcep(false)
  }

  const [showEditAbono, setShowEditAbono] = useState(false)
  const [abonoEdit, setAbonoEdit] = useState(null)

  const onOpenEditAbono = (index) => {
    setAbonoEdit(abonos[index])
    setAbonoAEliminar(index)
    setShowEditAbono(true)
  }

  const onCloseEditAbono = () => {
    setAbonoEdit(null)
    setShowEditAbono(false)
  }

  const [showEditAnticipo, setShowEditAnticipo] = useState(false)
  const [anticipoEdit, setAnticipoEdit] = useState(null)

  const onOpenEditAnticipo = (index) => {
    setAnticipoEdit(anticipos[index])
    setAnticipoAEliminar(index)
    setShowEditAnticipo(true)
  }

  const onCloseEditAnticipo = () => {
    setAnticipoEdit(null)
    setShowEditAnticipo(false)
  }

  const onHideConfirm = () => {
    setShowConfirmConcepto(false)
    setShowConfirmAbono(false)
    setShowConfirmAnticipo(false)
  }

  const validarForm = () => {
    const newErrors = {}
    if (!cliente_id) newErrors.cliente_id = 'El campo es requerido'
    if (!nota) newErrors.nota = 'El campo es requerido'
    if (!forma_pago) newErrors.forma_pago = 'El campo es requerido'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const opcionesFormaPago = [
    { key: 1, text: 'Único', value: 'unico' },
    { key: 2, text: 'Abonos', value: 'abonos' },
    { key: 3, text: 'Anticipo', value: 'anticipo' }
  ]

  const crearNota = async (e) => {
    e.preventDefault();

    if (!validarForm()) return

    setIsLoading(true);

    const folio = genNVId(4);
    const clienteSeleccionado = clientes.find(c => c.id === cliente_id)
    const cliente_nombre = clienteSeleccionado ? clienteSeleccionado.cliente : ''
    const cliente_contacto = clienteSeleccionado ? clienteSeleccionado.contacto : ''

    try {
      const res = await axios.post('/api/notas/notas', {
        usuario_id: user.id,
        usuario_nombre: user.nombre,
        nota,
        forma_pago,
        folio,
        cliente_id,
        cliente_nombre,
        cliente_contacto,
        negocio_id: user.negocio_id,
        negocio_nombre: user.negocio_nombre
      });

      const notaId = res.data.id;

      if (forma_pago === 'abonos') {
        if (productoBase) {
          await axios.post('/api/notas/abonos', {
            nota_id: notaId,
            usuario_id: user.id,
            tipo: '',
            metodo_pago: '',
            monto: productoBase.monto || 0,
            producto_nombre: productoBase.producto_nombre || '',
            producto_base: 1
          });
        }

        await Promise.all(abonos.map(abono =>
          axios.post('/api/notas/abonos', {
            nota_id: notaId,
            usuario_id: user.id,
            tipo: abono.tipo || '',
            metodo_pago: abono.metodo_pago || '',
            monto: abono.monto || 0,
            producto_nombre: '',
            producto_base: 0
          })
        ));
      } else if (forma_pago === 'anticipo') {
        if (productoBase) {
          await axios.post('/api/notas/anticipos', {
            nota_id: notaId,
            usuario_id: user.id,
            tipo: '',
            metodo_pago: '',
            monto: productoBase.monto || 0,
            producto_nombre: productoBase.producto_nombre || '',
            producto_base: 1
          });
        }

        await Promise.all(anticipos.map(anticipo =>
          axios.post('/api/notas/anticipos', {
            nota_id: notaId,
            usuario_id: user.id,
            tipo: anticipo.tipo || '',
            metodo_pago: anticipo.metodo_pago || '',
            monto: anticipo.monto || 0,
            producto_nombre: '',
            producto_base: 0
          })
        ));
      } else {
        await Promise.all(conceptos.map(item =>
          axios.post('/api/notas/conceptos', {
            nota_id: notaId,
            usuario_id: user.id,
            tipo: item.tipo,
            concepto: item.concepto,
            precio: item.precio,
            cantidad: item.cantidad,
            total: item.total
          })
        ));
      }

      setNota('');
      setFormaPago('');
      setCliente('');
      setConceptos([]);
      onReload();
      onOpenCloseForm();
      onToastSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const añadirConcepto = (nuevo) => {
    if (forma_pago === 'abonos') {
      const total = nuevo.monto || 0;
      setConceptos([...conceptos, { ...nuevo, total }]);
    } else {
      const total = nuevo.precio * nuevo.cantidad;
      setConceptos([...conceptos, { ...nuevo, total }]);
    }
  }

  const añadirAbono = (nuevoAbono) => {
    setAbonos(prev => [...prev, nuevoAbono]);
  }

  const añadirAnticipo = (nuevoAnticipo) => {
    setAnticipos(prev => [...prev, nuevoAnticipo]);
  }

  const eliminarConcepto = () => {
    const nuevosConceptos = conceptos.filter((_, i) => i !== conceptoAEliminar)
    setConceptos(nuevosConceptos)
    setShowConfirmConcepto(false)
    setShowEditConcep(false)
  }

  const eliminarAbono = () => {
    const nuevosAbonos = abonos.filter((_, i) => i !== abonoAEliminar)
    setAbonos(nuevosAbonos)
    setShowConfirmAbono(false)
    setShowEditAbono(false)
  }

  const eliminarAnticipo = () => {
    const nuevosAnticipos = anticipos.filter((_, i) => i !== anticipoAEliminar)
    setAnticipos(nuevosAnticipos)
    setShowConfirmAnticipo(false)
    setShowEditAnticipo(false)
  }

  const calcularTotales = () => {
    const montoProductoBase = productoBase?.monto || 0

    if (forma_pago === 'abonos') {
      const totalAbonos = abonos.reduce((acc, abono) => acc + (abono.monto || 0), 0)
      const saldoRestante = montoProductoBase - totalAbonos
      return { total: saldoRestante }
    }

    if (forma_pago === 'anticipo') {
      const totalAnticipos = anticipos.reduce((acc, a) => acc + (a.monto || 0), 0)
      const saldoRestante = montoProductoBase - totalAnticipos
      return { total: saldoRestante }
    }

    const total = conceptos.reduce((acc, curr) => acc + (curr.total || 0), 0)
    return { total }
  }

  const { total } = calcularTotales()

  return (
    <>
      <IconClose onOpenClose={onOpenCloseForm} />
      {toastSuccessCliente && <ToastSuccess contain='Creado exitosamente' onClose={() => setToastSuccessCliente(false)} />}

      <div className={styles.main}>
        <Form>
          <FormGroup widths='equal'>
            <FormField error={!!errors.nota}>
              <Label>Nota</Label>
              <Input
                type="text"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
              />
              {errors.nota && <Message>{errors.nota}</Message>}
            </FormField>
            <FormField error={!!errors.forma_pago}>
              <Label>Forma de pago</Label>
              <Dropdown
                placeholder='Seleccionar'
                fluid
                selection
                options={opcionesFormaPago}
                value={forma_pago}
                onChange={(e, { value }) => setFormaPago(value)}

              />
              {errors.forma_pago && <Message>{errors.forma_pago}</Message>}
            </FormField>
            <FormField error={!!errors.cliente_id}>
              <Label>Cliente</Label>
              <Dropdown
                placeholder={clientes.length === 0 ? 'No hay clientes' : 'Seleccionar'}
                fluid
                selection
                options={clientes.map(cliente => ({
                  key: cliente.id,
                  text: cliente.cliente,
                  value: cliente.id
                }))}
                value={cliente_id}
                onChange={(e, { value }) => setCliente(value)}
                disabled={clientes.length === 0}
              />
              <div className={styles.addCliente}>
                <h1>Crear cliente</h1>
                <FaPlus onClick={onOpenCloseClienteForm} />
              </div>
              {errors.cliente_id && <Message>{errors.cliente_id}</Message>}
            </FormField>
          </FormGroup>
        </Form>

        <div className={styles.section}>

          <RowHeadModal rowMain={forma_pago !== 'abonos' && forma_pago !== 'anticipo'} />

          {forma_pago === 'abonos' ? (
            abonos.map((abono, index) => (
              <div key={index} className={styles.rowMapAbonos} onClick={() => onOpenEditAbono(index)}>
                <h1>{abono.tipo}</h1>
                <h1>{abono.metodo_pago}</h1>
                <h1>{formatDateIncDet(abono.fecha_pago)}</h1>
                <h1>{formatCurrency(abono.monto)}</h1>
              </div>
            ))
          ) : forma_pago === 'anticipo' ? (
            anticipos.map((anticipo, index) => (
              <div key={index} className={styles.rowMapAbonos} onClick={() => onOpenEditAnticipo(index)}>
                <h1>{anticipo.tipo}</h1>
                <h1>{anticipo.metodo_pago}</h1>
                <h1>{formatDateIncDet(anticipo.fecha_pago)}</h1>
                <h1>{formatCurrency(anticipo.monto)}</h1>
              </div>
            ))
          ) : (
            conceptos.map((concepto, index) => (
              <div key={index} className={styles.rowMapConceptos} onClick={() => onOpenEditConcep(index)}>
                <h1>{concepto.tipo}</h1>
                <h1>{concepto.concepto}</h1>
                <h1>{formatCurrency(concepto.precio)}</h1>
                <h1>{concepto.cantidad}</h1>
                <h1>{formatCurrency(concepto.total)}</h1>
              </div>
            ))
          )}

          {forma_pago && (
            (forma_pago === 'abonos' && !yaTieneAbonoTipo) ||
            (forma_pago === 'anticipo' && !yaTieneAnticipoTipo) ||
            forma_pago === 'unico'
          ) && (
              <div className={styles.iconPlus}>
                <div onClick={() => {
                  if (forma_pago === 'abonos') {
                    if (!tieneProductoBase) {
                      setShowProductoBaseModal(true);
                    } else {
                      setShowAbonoModal(true);
                    }
                  } else if (forma_pago === 'anticipo') {
                    if (!tieneProductoBase) {
                      setShowProductoBaseModal(true);
                    } else {
                      setTituloAnticipo(yaTieneAnticipo ? 'Agregar abono' : 'Agregar anticipo')
                      setShowAnticipoModal(true)
                    }
                  } else {
                    setShowForm(true);
                  }
                }}>
                  <FaPlus />
                </div>
              </div>
            )}

          {(forma_pago === 'abonos' || forma_pago === 'anticipo') && productoBase && total === 0 ? (
            <div className={styles.box3}>
              <div className={styles.box3_2}>
                <h1 className={styles.pagado}>PAGADO</h1>
              </div>
            </div>
          ) : (
            <div className={styles.box3}>
              <div className={styles.box3_1}>
                <h1>
                  {forma_pago === 'abonos' || forma_pago === 'anticipo'
                    ? 'Saldo restante:'
                    : 'Total'}
                </h1>
              </div>

              <div className={styles.box3_2}>
                <h1>{formatCurrency(total)}</h1>
              </div>
            </div>
          )}

        </div>

        {(forma_pago === 'abonos' || forma_pago === 'anticipo') && productoBase && productoBase.tipo !== nota && (
          <div className={styles.productoBaseBox}>
            <h1><span className={styles.span}>Producto:</span> {productoBase.producto_nombre}</h1>
            <h1><span className={styles.span}>Precio:</span> {formatCurrency(productoBase.monto)}</h1>
            <FaEdit onClick={onOpenEditProductoBase} />
          </div>
        )}

        <Button primary loading={isLoading} onClick={crearNota}>Crear</Button>
      </div>

      <BasicModal title='crear cliente' show={show} onClose={onOpenCloseClienteForm}>
        <ClienteForm user={user} reload={reload} onReload={onReload} onCloseForm={onOpenCloseClienteForm} onToastSuccess={onToastSuccessCliente} />
      </BasicModal>

      {/* Modal de Conceptos normales */}
      <BasicModal title="Agregar concepto" show={showConcep} onClose={onOpenCloseConcep}>
        <ConceptosForm añadirConcepto={añadirConcepto} onOpenCloseConcep={onOpenCloseConcep} />
      </BasicModal>

      <BasicModal title="Agregar producto" show={showProductoBaseModal} onClose={() => setShowProductoBaseModal(false)}>
        <ProductoBaseForm
          onSave={(nuevo) => {
            añadirConcepto({ ...nuevo, producto_base: 1 })
            setProductoBase(nuevo)
            setShowProductoBaseModal(false)
          }}
          onCancel={() => setShowProductoBaseModal(false)}
        />
      </BasicModal>

      <BasicModal title="Editar producto" show={showEditProductoBase} onClose={onCloseEditProductoBase}>
        <ProductoBaseEditForm
          productoBase={productoBase}
          onSave={(updated) => {
            setProductoBase(updated);
            setConceptos((prev) => {
              const index = prev.findIndex(c => c.producto_base === 1);
              if (index !== -1) {
                const nuevos = [...prev];
                nuevos[index] = { ...updated, producto_base: 1 };
                return nuevos;
              }
              return prev;
            });
            setShowEditProductoBase(false);
          }}
          onCancel={onCloseEditProductoBase}
          onDelete={() => {
            setShowEditProductoBase(false);
            setShowConfirmProducto(true);
          }}
        />
      </BasicModal>

      <BasicModal title="Editar concepto" show={showEditConcep} onClose={onCloseEditConcep}>
        <ConceptosEditForm
          concepto={conceptoEdit}
          index={conceptoAEliminar}
          onSave={(updatedConcepto) => {
            const nuevos = [...conceptos]
            nuevos[conceptoAEliminar] = updatedConcepto
            setConceptos(nuevos)
            onCloseEditConcep()
          }}
          onCloseEditConcep={onCloseEditConcep}
          onOpenCloseConfirm={onOpenCloseConfirm}
        />
      </BasicModal>

      <BasicModal title={'agregar abono'} show={showAbonoModal} onClose={() => setShowAbonoModal(false)}>
        <AbonosForm
          añadirAbono={(abono) => {
            añadirAbono({ ...abono, producto_base: 0 })
            setShowAbonoModal(false)
          }}
          onOpenCloseConcep={() => setShowAbonoModal(false)}
        />
      </BasicModal>

      <BasicModal title="Editar abono" show={showEditAbono} onClose={onCloseEditAbono}>
        <AbonosEditForm
          abono={abonoEdit}
          index={abonoAEliminar}
          onSave={(updatedAbono) => {
            const nuevos = [...abonos]
            nuevos[abonoAEliminar] = updatedAbono
            setAbonos(nuevos)
            onCloseEditAbono()
          }}
          onCloseEditAbono={onCloseEditAbono}
          onOpenCloseConfirmAbono={onOpenCloseConfirmAbono}
        />
      </BasicModal>

      <BasicModal title={tituloAnticipo} show={showAnticipoModal} onClose={() => setShowAnticipoModal(false)}>
        <AnticiposForm
          esPrimero={!yaTieneAnticipo}
          añadirAnticipo={(anticipo) => {
            añadirAnticipo({ ...anticipo, producto_base: 0 });
            setShowAnticipoModal(false);
          }}
          onOpenCloseConcep={() => setShowAnticipoModal(false)}
        />
      </BasicModal>

      <BasicModal title="Editar anticipo" show={showEditAnticipo} onClose={onCloseEditAnticipo}>
        <AnticiposEditForm
          anticipo={anticipoEdit}
          index={anticipoAEliminar}
          onSave={(updatedAnticipo) => {
            const nuevos = [...anticipos]
            nuevos[anticipoAEliminar] = updatedAnticipo
            setAnticipos(nuevos)
            onCloseEditAnticipo()
          }}
          onCloseEditAnticipo={onCloseEditAnticipo}
          onOpenCloseConfirmAnticipo={onOpenCloseConfirmAnticipo}
        />
      </BasicModal>

      <Confirm
        open={showConfirmConcepto}
        onConfirm={eliminarConcepto}
        onCancel={onHideConfirm}
        content='¿Estás seguro de eliminar el concepto?'
      />

      <Confirm
        open={showConfirmAbono}
        onConfirm={eliminarAbono}
        onCancel={onHideConfirm}
        content='¿Estás seguro de eliminar el abono?'
      />

      <Confirm
        open={showConfirmAnticipo}
        onConfirm={eliminarAnticipo}
        onCancel={onHideConfirm}
        content='¿Estás seguro de eliminar el anticipo?'
      />

      <Confirm
        open={showConfirmProducto}
        onConfirm={eliminarProducto}
        onCancel={onHideConfirm}
        content='¿Estás seguro de eliminar el producto?'
      />

    </>
  )
}
