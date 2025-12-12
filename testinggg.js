fetch('http://10.110.5.202:5000/api/health')
  .then(r => r.json())
  .then(data => console.log('✅ Success:', data))
  .catch(err => console.error('❌ Error:', err))