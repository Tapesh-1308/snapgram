import {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'

const ProfileUploader = ({ fieldChange, mediaUrl }) => {
  const [fileUrl, setFileUrl] = useState(mediaUrl);
  const [file, setFile] = useState([]);

  const onDrop = useCallback(acceptedFiles => {
    setFile(acceptedFiles);
    fieldChange(acceptedFiles);
    setFileUrl(URL.createObjectURL(acceptedFiles[0]))
  }, [file])

  const {getRootProps, getInputProps} = useDropzone({onDrop, accept: {
    'image/*' : ['.png', '.jpeg', '.jpg', '.svg']
  }})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} className='cursor-pointer'/>

      <div className="cursor-pointer flex-center gap-4">
        <img src={fileUrl || "/assets/icons/profile-placeholder.svg"} alt="profile" className='h-24 w-24 rounded-full object-cover object-top'/>
        <p className='text-primary-500 small-regular md:base-semibold'>
          Change profile photo
        </p>
      </div>
    </div>
  
  )
}

export default ProfileUploader