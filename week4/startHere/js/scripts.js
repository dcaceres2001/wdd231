const params = new URLSearchParams(window.location.search);

console.log(params.toString());

document.querySelector('#results').innerHTML = `
  <p>You have made an appointment for ${params.get('first')} ${params.get('last')}</p>
    <p>Your appointment is on ${params.get('date')} at ${params.get('location')} for ${params.get('ordinance')}</p>
    <p>We will contact you at ${params.get('email')} if we need to reschedule.</p>
`;


