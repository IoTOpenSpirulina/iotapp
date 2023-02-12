const express = require('express');
const router = express.Router();
const { checkAuth } = require('../middlewares/authentication.js');

//models import
import Balsa from '../models/balsa';
import Device from '../models/device.js';

//get balsas
router.get('/balsa', checkAuth, async (req, res) => {

    try {

        const userId = req.userData._id;

        const balsas = await Balsa.find({userId: userId});

        console.log(userId);
        // console.log("estas son las balsas\n\n",balsas)

        const response = {
            status: "success",
            data: balsas
        }

        return res.json(response);

    } catch (error) {

        console.log(error);

        const response = {
            status: "error",
            error: error
        }

        return res.status(500).json(response);

    }

});

//create balsa
router.post('/balsa', checkAuth, async (req, res) => {

    try {

        const userId = req.userData._id;

        var newBalsa = req.body.balsa;

        newBalsa.userId = userId;
        newBalsa.createdTime = Date.now();

        console.log("newBalsa:          ",newBalsa)

        const r = await Balsa.create(newBalsa);

        const response = {
            status: "success",
        }

        return res.json(response)

    } catch (error) {

        console.log(error);

        const response = {
            status: "error",
            error: error
        }

        return res.status(500).json(response);

    }

});

//delete balsa
router.delete('/balsa', checkAuth, async (req, res) => {

    try {

        const userId = req.userData._id;
        const balsaId = req.query.balsaId;

        const devices = await Device.find({userId: userId, balsaId: balsaId });


        if (devices.length > 0){

            const response = {
                status: "fail",
                error: "balsa in use"
            }
    
            return res.json(response);
        }

        const r = await Balsa.deleteOne({userId: userId, _id: balsaId});

        const response = {
            status: "success",
        }

        return res.json(response)

    } catch (error) {

        console.log(error);

        const response = {
            status: "error",
            error: error
        }

        return res.status(500).json(response);

    }

});

//update balsa (SELECTOR)
router.put("/balsa", checkAuth, async (req, res) => {
    try {
      const bId = req.body.bId;
      const userId = req.userData._id;
  
      if (await selectBalsa(userId, bId)) {
        const response = {
          status: "success"
        };
  
        return res.json(response);
      } else {
        const response = {
          status: "error"
        };
  
        return res.json(response);
      }
    } catch (error) {
      console.log(error);
    }
  });

/* ***************************
 * FUNCTIONS
 *************************** */

async function selectBalsa(userId, bId) {
    try {
      const result = await Balsa.updateMany(
        { userId: userId },
        { selected: false }
      );
  
      const result2 = await Balsa.updateOne(
        { _id: bId, userId: userId },
        { selected: true }
      );
  
      return true;
    } catch (error) {
      console.log("ERROR IN 'selectBalsa' FUNCTION ");
      console.log(error);
      return false;
    }
  }

module.exports = router;