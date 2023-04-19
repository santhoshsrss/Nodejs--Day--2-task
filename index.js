const express = require('express');
const app = express();
app.use(express.json());


let rooms = [
  {
    id:1,
    name:"Elite",
    seats : 50,
    roomId: 1,
    date :"2023-02-24",
    start:"11:00",
    amenities : ["Free-wifi","food","ac","ProjectionScreen,Cushions"],
    price:500,
    BookingStatus : "Occupied",
    customerDetails : {
      cutstomerName : "Santhosh",
      date :"2023-02-23",
      start : "15:00",
      end : "20:00",
      roomId : "1",
      status : "Booked",
    }
  },
  {
    id:2,
    name:"Premeium",
    seats : 100,
    roomId: 2,
    date :"2023-02-24",
    start:"11:00",
    amenities : ["Free-wifi","ac","ProjectionScreen,Chair"],
    price:1000,
    BookingStatus : "Available",
    customerDetails : {
      cutstomerName : "",
      date : "",
      start : "",
      end : "",
      roomId : "",
      status : "",
    }
  }
];

//create room

app.post('/createRoom', function (req, res) {
try {
  req.body.id = rooms.length + 1;
  rooms.push(req.body)
  res.json({
    message:"Room created successfully",
    })
} catch (error) {
  console.log(error);
  res.json({
    message:"Internal Server Error",
    error,
  })
}
})

//to book a room

app.post('/bookRoom', function (req, res) {
  try {
    let booked = false;
    let validRoomid = true;
    rooms.forEach((item) => {
      if (item.roomId == req.body.roomId) {
         validRoomid = false;
        if (new Date(item.date).getTime() != new Date(req.body.date).getTime() && item.start != req.body.start) {
          item.customerDetails.cutstomerName = req.body.name,
            item.customerDetails.date = req.body.date,
            item.customerDetails.start = req.body.start,
            item.customerDetails.end = req.body.end,
            item.customerDetails.roomId = req.body.roomId,
            item.customerDetails.status = "Booked",
            item.BookingStatus = "Occupied",
            booked = true;
         
        }
      }

    })

    if (booked) {
      res.json({
        message: "Booking Successfull"
      })
    }
    if(validRoomid){
      res.json({
        message: "Plz Enter Valid Room number"
      })
    } else {
      res.json({
        message: "Booking Failed",
        instruction: "Sorry! Room is Already Booked and check the availability"
      })
    }

  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
      error,
    })
  }
})

//List the customers

app.get('/listCustomer', function (req, res) {

try {
  let data = [];

  rooms.forEach((item)=>{
    if(item.BookingStatus == "Occupied"){
      data.push(item.customerDetails)
    }
  })
  res.json({
    Customer_Details : data,
  })
  
} catch (error) {
  res.json({
    statusCode: 500,
    message: "Internal Server Error",
    error,
  })
}

})

//List room along with booking details

app.get("/listRooms",(req,res)=>{
  res.send(rooms)
})

app.get('/', function(req,res){
  res.json({
    "Room details":"/listRooms",
    "Number of customer": "/listCustomer",

  })
})


const port = 4000
app.listen(port,()=>{
    console.log("server started in the port",port)
})