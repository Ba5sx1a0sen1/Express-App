fetch('http:127.0.0.1:3000/download/5c711239fc8c2017a31eae43',{
	method: 'get',
	headers: {
    'x-access-token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im5hbWUiOiJ4eHh4IiwicGFzc3dvcmQiOiJ4eHh4In0sImV4cCI6MTU1MDk4ODk0NiwiaWF0IjoxNTUwOTAyNTQ2fQ.SWu3qLy_DI7ADclprILqhLMFdCZn1KU2p-HbrTDmsRQ'
	}
}).then(
  (res) => ({
    filename: res.headers.get('content-disposition').match(/filename="(.*)"$/)[1],
    res
  })
).then(blobobj => {
    var a = document.createElement('a');
    blobobj.res.blob().then(blob => {
      var url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = blobobj.filename;
      a.click();
      window.URL.revokeObjectURL(url);
    })
})