const { response, request } = require('express');
const axios = require('axios');
const { ClientSession } = require('mongodb');
//const interval = require('../interval');

const getHorario = async (req, res) => {
    token = JSON.stringify(req.headers.token);
    token = token.slice(1,-1);
    //const { id} = req.params;
    //console.log(token);
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    estatus = 200;
    //console.log(token);
    let resp = await axios.get(`https://api.mercadolibre.com/users/345930669/shipping/schedule/cross_docking`, config).
    catch(err => {
        // console.log('hola');
        // console.log(err.response.data);
        estatus = 404;
        res.status(404).json({
            msg: err.response.data
        });
    });
    //console.log(resp.data.schedule.monday.detail);
    if (estatus == 200) {
      const dias = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
      const nombresDias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
    
      const horario = dias.map((dia, index) => {
        const detalle = resp.data.schedule[dia]?.detail;
        const item = detalle && detalle.length > 0 ? detalle[0] : null;
    
        return {
          dia: nombresDias[index],
          from: item?.from ?? '',
          to: item?.to ?? '',
          cutoff: item?.cutoff ?? '',
          driver: item?.driver?.name ?? '',
          patente: item?.vehicle?.license_plate ?? '',
          tipo_vehiculo: item?.vehicle?.vehicle_type ?? ''
        };
      });
    
      res.json(horario);
    }

   /* if (estatus == 200){

        res.json([
          
            {
              //'id_envio':resp2.data.shipping.id
              'dia': 'Lunes',
              'from':resp.data.schedule.monday.detail[0].from ?? '',
              'to': resp.data.schedule.monday.detail[0].to ?? '',
              'cutoff': resp.data.schedule.monday.detail[0].cutoff ?? '',
              'driver': resp.data.schedule.monday.detail[0].driver.name ?? '',
              'patente': resp.data.schedule.monday.detail[0].vehicle.license_plate ?? '',
              'tipo_vehiculo': resp.data.schedule.monday.detail[0].vehicle.vehicle_type ?? ''
          },
          {
            //'id_envio':resp2.data.shipping.id
            'dia': 'Martes',
            'from':resp.data.schedule.tuesday.detail[0].from ?? '',
            'to': resp.data.schedule.tuesday.detail[0].to ?? '',
            'cutoff': resp.data.schedule.tuesday.detail[0].cutoff ?? '',
            'driver': resp.data.schedule.tuesday.detail[0].driver.name ?? '',
            'patente': resp.data.schedule.tuesday.detail[0].vehicle.license_plate ?? '',
            'tipo_vehiculo': resp.data.schedule.tuesday.detail[0].vehicle.vehicle_type ?? ''
        },
        {
          //'id_envio':resp2.data.shipping.id
          'dia': 'Miercoles',
          'from':resp.data.schedule.wednesday.detail[0].from ?? '',
          'to': resp.data.schedule.wednesday.detail[0].to ?? '',
          'cutoff': resp.data.schedule.wednesday.detail[0].cutoff ?? '',
          'driver': resp.data.schedule.wednesday.detail[0].driver.name ?? '',
          'patente': resp.data.schedule.wednesday.detail[0].vehicle.license_plate ?? '',
          'tipo_vehiculo': resp.data.schedule.wednesday.detail[0].vehicle.vehicle_type ?? ''
      },
      {
        //'id_envio':resp2.data.shipping.id
        'dia': 'Jueves',
        'from':resp.data.schedule.thursday.detail[0].from ?? '',
        'to': resp.data.schedule.thursday.detail[0].to ?? '',
        'cutoff': resp.data.schedule.thursday.detail[0].cutoff ?? '',
        'driver': resp.data.schedule.thursday.detail[0].driver.name ?? '',
        'patente': resp.data.schedule.thursday.detail[0].vehicle.license_plate ?? '',
        'tipo_vehiculo': resp.data.schedule.thursday.detail[0].vehicle.vehicle_type ?? ''
    },
    {
      //'id_envio':resp2.data.shipping.id
      'dia': 'Viernes',
      'from':resp.data.schedule.friday.detail[0].from ?? '',
      'to': resp.data.schedule.friday.detail[0].to ?? '',
      'cutoff': resp.data.schedule.friday.detail[0].cutoff ?? '',
      'driver': resp.data.schedule.friday.detail[0].driver.name ?? '',
      'patente': resp.data.schedule.friday.detail[0].vehicle.license_plate ?? '',
      'tipo_vehiculo': resp.data.schedule.friday.detail[0].vehicle.vehicle_type ?? ''
  }
      
      ]);
    }*/
}

module.exports = {

    getHorario

}