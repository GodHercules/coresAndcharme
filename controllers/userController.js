const nodemailer = require('nodemailer');

exports.sendConfirmationEmail = (req, res) => {
    const { email } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'seu-email@gmail.com',
            pass: 'sua-senha'
        }
    });

    let mailOptions = {
        from: 'seu-email@gmail.com',
        to: email,
        subject: 'Confirmação de Cadastro',
        text: 'Obrigado por se cadastrar! Por favor, confirme seu email clicando no link abaixo.',
        html: '<b>Obrigado por se cadastrar!</b><br>Por favor, confirme seu email clicando no link abaixo.<br><a href="http://seusite.com/confirmar-email">Confirmar Email</a>'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Email de confirmação enviado');
    });
};
