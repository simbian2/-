const Sequelize = require('sequelize'); // class 

class User1 extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            id:{
                type:Sequelize.INTEGER(30),
                primaryKey:true,
            },
            userid:{
                type:Sequelize.STRING(30),
            },
            userpw:{
                type:Sequelize.STRING(30),
            },
        },{
            sequelize,
            timestamps:false,
            underscored:false,
            paranoid:false,
            modelName:'User1',
            tableName:'homework',
            charset:'utf8',
            collate:'utf8_general_ci'
        });
    }
}

module.exports = {
    User1,
}
