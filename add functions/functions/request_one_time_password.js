const admin=require('firebase-admin');
const twilio=require('./twilio');

module.exports = function(req,res){
  if(!req.body.phone){
    console.log('Error: You must provide a phone number');
    return res.status(422).send({error: 'You must provide a phone number'});
  }

  const phone = String(req.body.phone).replace(/[^\d]/g, '');

  admin.auth().getUser(phone)
    .then(userRecord => {
      const code=Math.floor(Math.random()*8999+1000)

      twilio.messages.create({
        body: 'Your code is '+code,
        to: phone,
        from: '+16316852059'
      }, (err) => {
        if (err) {
          console.log(err);
          return res.status(422).send(err);
        }

        admin.database().ref('users/'+phone)
          .update({code: code, codeValid: true},()=>{
            res.send({success: true});

          })
      })
      return;


    })
    .catch(
      //(err) => {  res.status(422).send({error: err})}
    );
}
