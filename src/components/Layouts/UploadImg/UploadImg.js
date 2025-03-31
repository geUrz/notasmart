import { useState, useRef, useEffect } from "react";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Button, Form, FormField, FormGroup, Loader, Message } from "semantic-ui-react";
import axios from "axios";
import styles from "./UploadImg.module.css";
import { IconClose } from "../IconClose";
import { BiSolidToggleLeft, BiSolidToggleRight } from "react-icons/bi";

export function UploadImg(props) {
  const { onReload, itemId, onShowSubirImg, endpoint, onSuccess, selectedImageKey } = props;
  const [fileName, setFileName] = useState("No se ha seleccionado ningún archivo")
  const [selectedImage, setSelectedImage] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [aspectRatio, setAspectRatio] = useState(1) 
  const [cropperKey, setCropperKey] = useState(Date.now())
  const cropperRef = useRef(null)
  const [isSquare, setIsSquare] = useState(true) 

  useEffect(() => {
    const savedIsSquare = localStorage.getItem("isSquare")
    if (savedIsSquare !== null) {
      const isSquareValue = JSON.parse(savedIsSquare) 
      setIsSquare(isSquareValue)
      setAspectRatio(isSquareValue ? 1 : 16 / 9)
      setCropperKey(Date.now()) 
    }
  }, [])

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!["image/jpg", "image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Tipo de archivo no permitido.")
      return
    }

    setError("")
    setFileName(file.name)
    setSelectedImage(URL.createObjectURL(file))
  };

  const handleAspectRatioChange = (isSquareSelected) => {
    setIsSquare(isSquareSelected)
    setAspectRatio(isSquareSelected ? 1 : 21 / 9)
    setCropperKey(Date.now()) 
    localStorage.setItem("isSquare", JSON.stringify(isSquareSelected)) 
  };

  const handleImageUpload = async () => {
    if (!cropperRef.current) return

    setLoading(true)

    const cropper = cropperRef.current.cropper;
    cropper.getCroppedCanvas().toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("file", blob);
      formData.append("id", itemId);
      formData.append("imageKey", selectedImageKey);
    
      try {
        const res = await axios.post(`/api/${endpoint}/uploadImage`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
    
        const imageUrl = res.data.filePath;
        onSuccess(selectedImageKey, imageUrl);
        onReload();
        onShowSubirImg();
      } catch (error) {
        setError("Error al subir la imagen.");
      } finally {
        setLoading(false);
      }
    }, "image/png")
    
    
  };

  return (
    <>
      <IconClose onOpenClose={onShowSubirImg} />
      <div className={styles.main}>
        <div className={styles.img}>
          {selectedImage && (
            <Cropper
              key={cropperKey} 
              src={selectedImage}
              style={{ height: 300, width: '100%' }}
              aspectRatio={aspectRatio}
              guides={true}
              ref={cropperRef}
              viewMode={1}
              dragMode="move"
              cropBoxMovable={false}
              cropBoxResizable={false}
              background={false}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false}
            />
          )}
        </div>

        <div className={styles.toggleMain}>
          <div>
            <h2>Cuadrado</h2>
            <div className={isSquare ? styles.toggleON : styles.toggleOFF} onClick={() => handleAspectRatioChange(true)}>
              {isSquare ? <BiSolidToggleRight /> : <BiSolidToggleLeft />}
            </div>
          </div>
          <div>
            <h2>Rectángulo</h2>
            <div className={!isSquare ? styles.toggleON : styles.toggleOFF} onClick={() => handleAspectRatioChange(false)}>
              {!isSquare ? <BiSolidToggleRight /> : <BiSolidToggleLeft />}
            </div>
          </div>
        </div>

        <Form>
          <FormGroup widths="equal">
            <FormField>
              <label htmlFor="file" className="ui icon button">
                <Button as="span" secondary>
                  {!selectedImage ? "Seleccionar imagen" : "Cambiar imagen"}
                </Button>
              </label>
              <input id="file" type="file" hidden accept="image/*" onChange={handleImageSelect} />
              <span>{fileName}</span>
              {error && <Message negative>{error}</Message>}
              <Button onClick={handleImageUpload} primary disabled={!selectedImage || loading}>
                {loading ? <Loader active inline size="small" /> : "Subir Imagen"}
              </Button>
            </FormField>
          </FormGroup>
        </Form>
      </div>
    </>
  )
}
