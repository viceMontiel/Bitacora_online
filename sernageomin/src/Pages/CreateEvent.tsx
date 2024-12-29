import { useState } from 'react';
import { useAuth } from '../context/authContext';

function CreateEvent() {
  const [programa, setPrograma] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  const { creationEvent } = useAuth();

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    setAlertMessage('');
    setAlertType('');

    if (!programa || !descripcion) {
      setAlertMessage('Los campos de programa y descripción son obligatorios.');
      setAlertType('danger');
      return;
    }

    const formData = new FormData();
    formData.append('programa', programa);
    formData.append('descripcion', descripcion);

    // Agrega cada imagen al objeto FormData
    images.forEach((image) => formData.append('images', image));

    try {
      const response = await creationEvent(formData);

      if (response.success) {
        setAlertMessage('Evento creado exitosamente.');
        setAlertType('success');
        setPrograma('');
        setDescripcion('');
        setImages([]);
      } else {
        throw new Error(response.message || 'Error al crear el evento.');
      }
    } catch (error) {
      console.error(error);
      setAlertMessage('Ocurrió un error al enviar los datos.');
      setAlertType('danger');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedImages = Array.from(e.target.files);
      setImages(selectedImages);
      console.log('Imágenes seleccionadas:', selectedImages);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="p-3">Crear Evento</h1>

      {alertMessage && (
        <div className={`alert alert-${alertType} mt-3`} role="alert">
          {alertMessage}
        </div>
      )}

      <form onSubmit={handleCreateEvent} className="mt-4 pb-3">
        <div className="mb-3">
          <label htmlFor="programa" className="form-label">Fuente de la Información</label>
          <input
            type="text"
            className="form-control"
            id="programa"
            value={programa}
            onChange={(e) => setPrograma(e.target.value)}
            placeholder="Ingrese la fuente de información asociada al evento"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">Descripción</label>
          <textarea
            className="form-control"
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describa el evento"
            rows={4}
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="images" className="form-label">Imágenes (Opcionales)</label>
          <input
            type="file"
            className="form-control"
            id="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Crear Evento</button>
      </form>
    </div>
  );
}

export default CreateEvent;
