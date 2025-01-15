import { useState } from 'react';
import { useAuth } from '../context/authContext';


function Profile() {
    const [userName, setUserName] = useState<any | null>(null);
      const { fetchProfile } = useAuth();
    
      const tellName = async () => {
        try {
          const data = await fetchProfile();
          console.log(data)
          setUserName(data.msg.nombre); // Actualizar el nombre en el estado
        } catch (error) {
          console.error(error);
        }
      };
  return (
    <div>
        <div onClick={tellName}>pepito</div>
        Nombre: {userName}
    </div>
  )
}

export default Profile