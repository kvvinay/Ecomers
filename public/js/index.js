const submit = document.getElementById('logsub')
const email = document.getElementById('email')
const pass = document.getElementById('pass')


submit.addEventListener('click', async () => {

    const data = {
        email: email.value,
        pass:  pass.value
    }
    const response = await fetch('http://localhost:3000/auth', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(data)
    })
    const res = await response.json();
    console.log(res)
    if(res.status === 200){
        location.replace(res.page)
    }else{

    }
})