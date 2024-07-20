const changeFileName = (e) => {
  e.preventDefault()
  const identification = document.getElementById("identification")
  const proofOfAddress = document.getElementById("proofOfAddress")
  const proofOfAccount = document.getElementById("proofOfAccount")

  const renameFile = (file, newName) => {
    if (!file) return null
    const fileExt = file.name.split('.').pop()
    const newFileName = `${newName}.${fileExt}`
    return new File([file], newFileName, { type: file.type })
  }

  const renamedIdentification = renameFile(identification?.files[0], "identification")
  const renamedProofOfAddress = renameFile(proofOfAddress?.files[0], "proofOfAddress")
  const renamedProofOfAccount = renameFile(proofOfAccount?.files[0], "proofOfAccount")

  const renamedFiles = [renamedIdentification, renamedProofOfAddress, renamedProofOfAccount].filter(file => file !== null)

  if (renamedFiles.length > 0) {
    uploadFiles(renamedFiles)
  } else {
    Swal.fire({
      title: "Oops...",
      text: `You must select a document.`,
      icon: "error",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000
    })
  }
}

const uploadFiles = (files) => {
  const uid = document.getElementById("uid").innerHTML
  const formData = new FormData()
  files.forEach((file) => { formData.append("document", file) })

  fetch(`/api/user/premium/${uid}/documents`, {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        Swal.fire({
          title: "Good job!",
          text: `${data.message}`,
          icon: "success",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000
        })
      } else if (data.status === "error") {
        Swal.fire({
          title: "Oops...",
          text: `${data.message}`,
          icon: "error",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000
        })
      }
    })
    .catch((e) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${e.error}`,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000
      })
    })
}

const updateDocuments = document.getElementById("updateDocuments")

updateDocuments.addEventListener("submit", changeFileName)