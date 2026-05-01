import { useDropzone } from "react-dropzone";

export default function ImageAnalysis() {
  const { getRootProps, getInputProps } = useDropzone();

  return (
    <div>
      <h1 className="text-3xl mb-4">Image Analysis</h1>

      <div
        {...getRootProps()}
        className="border-2 border-dashed p-10 text-center rounded-xl bg-white/10"
      >
        <input {...getInputProps()} />
        <p>Drag & drop house image here</p>
      </div>
    </div>
  );
}