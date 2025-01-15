import { Carousel } from 'react-bootstrap';
import './ImgCarousel.css'

interface ImgCaruselProps {
  images: string[];
}

export const ImgCaruselBig = ({ images }: ImgCaruselProps) => {
  const validImages = Array.isArray(images) ? images : [];
  return (
    <Carousel interval={null} slide={false} className='big'>
      {validImages.map((archivo, index) => (
        <Carousel.Item key={index} >
          <img className="h-100 w-100" src={archivo} alt={`Imagen ${index + 1}`} />
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

