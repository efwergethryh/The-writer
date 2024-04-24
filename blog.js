function create_blog(){
    const formData = new FormData(document.getElementById('#blog'));
    console.log(formData);
    fetch('localhost:3000/add-blogs',{
        method: 'GET',
        body: formData,
        headers: {
            'Content-Type': 'application/json',
        },
    }) .then(response => response.json())
    .then(data => {
        console.log('Form submission successful:', data);
        // Handle the response as needed (e.g., show a success message)
    })
    .catch(error => {
        console.error('Form submission failed:', error);
        // Handle errors (e.g., show an error message)
    });
}