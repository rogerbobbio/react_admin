/*
MYSQL Controller
*/
const path = require('path');

const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
var UserService = require('../../components/user/user.service');

async function uploads(req, res) {

    const uid = req.uid;

    const type = req.params.type;
    const id = req.params.id;

    const validTypes = ['users'];
    if (!validTypes.includes(type)){
        return res.status(400).json({
            ok: false,
            msg: `The type ${type} is not valid`
          });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No files were uploaded.'
          });
    }

    const file = req.files.image;
    const fileName = file.name.split('.');
    const fileExtension = fileName[fileName.length - 1];

    const validExtensions =  ['png','jpg','jpeg','gif'];
    if (!validExtensions.includes(fileExtension)){
        return res.status(400).json({
            ok: false,
            msg: `The file extension  ${fileExtension} is not valid`
          });
    }

    const newFileName = `${ uuidv4() }.${ fileExtension }`;

    //Path para guardar el archivo
    const path = `./uploads/${ type }/${ newFileName }`;

    // Use the mv() method to place the file somewhere on your server
    file.mv(path, (err) => {
        if (err){
            console.log(err);
            return res.status(400).json({
                ok: false,
                msg: 'Error to try to move the file'
            });
        }

        //Update DB
        switch(type){
            case 'users':
    
                UserService.getUserInfoById(id)
                .then(function(user) {
                    if(!user){
                        fs.unlinkSync(path);
                        return res.status(400).json({
                            ok: false,
                            msg: `User id ${id} was not found`
                        });                        
                    }
                    
                    const oldPath = `./uploads/users/${user.img}`;

                    //si existe la imagen en el usuario lo borra
                    if(user.img) {
                        if (fs.existsSync(oldPath)){
                            //se borra la imagen
                            fs.unlinkSync(oldPath);                        
                        }
                    }                    

                    req.body.img = newFileName;
                    req.body.user_update = uid;
                    req.body.update_date = new Date();

                    UserService.updateUser(id, req)
                        .then(function(user) {
                            
                        res.send({
                            ok: true,
                            msg: 'File uploaded!',
                            newFileName,
                            affectedRows: user.affectedRows
                        });
                    })
                })            
                break;
        }
    });

}

async function getImage(req, res) {
    const type = req.params.type;
    const imageName = req.params.image;

    const pathImg = path.join(__dirname, `../../uploads/${ type }/${ imageName }`);
    const pathImgDummy = path.join(__dirname, `../../uploads/No-Image-Available.png`);

     if (fs.existsSync(pathImg)){        
        res.sendFile(pathImg);
    } else {
        res.sendFile(pathImgDummy);
    }    
}

module.exports = {
    uploads,
    getImage
}