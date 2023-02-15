let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Methods",
		"GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
	);
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});
//const port = 2410;
var port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

let { carMaster, cars } = require("./carsData.js");

app.get("/cars", function(req, res) {
	let minprice = req.query.minprice;
	let maxprice = req.query.maxprice;
	let fuel = req.query.fuel;
	let type = req.query.type;
	let sort = req.query.sort;
	let arr1 = cars;

	if(minprice) {
		arr1 = arr1.filter((car) => car.price >= minprice);
	}
	if(maxprice) {
		arr1 = arr1.filter((car) => car.price <= maxprice);
	}
	if(fuel) {
		arr1 = arr1.filter((car) => {
		let index = carMaster.findIndex((c) => c.model === car.model);
		if(index>=0) {
			if(carMaster[index].fuel === fuel) {
				return car;
			}
		}
	  else 
			return arr1;
	});
	}
	if(type) {
		arr1 = arr1.filter((car) => {
			let index = carMaster.findIndex((c) => c.model === car.model);
			if(index>=0) {
				if(carMaster[index].type === type) {
					return car;
				}
			}
			else 
				return arr1;
		});
	}
	if(sort) {
		arr1 = (sort === "kms") ? arr1.sort((a1, a2) => a1.kms - a2.kms) :
		(sort === "price") ? arr1.sort((a1, a2) => a1.price - a2.price) :
		(sort === "year") ? arr1.sort((a1, a2) => a1.year - a2.year) :
		arr1;
	}
	res.send(arr1);
});

app.post("/cars", function (req, res) {
	let body = req.body;
	let newCar = {...body};
	cars.push(newCar);
	res.send(newCar);
});

app.get("/cars/:id", function(req, res) {
	let id = req.params.id;
	let car = cars.find((c) => c.id === id);
	if (car)
		res.send(car);
	else
		res.status(404).send("No Data Found");
});

app.put("/cars/:id", function(req, res) {
	let id = req.params.id;
	let body = req.body;
	let index = cars.findIndex((c) => c.id === id);
	if (index>=0) {
		let updatedCar = {...body};
		customerData[index] = updatedCar;
		res.send(updatedCar);
	}
	else {
		res.status(404).send("No car found");
	}
});

app.delete("/cars/:id", function (req, res) {
	let id = req.params.id;
	let index = cars.findIndex((c) => c.id === id);
	if(index >= 0) {
		let deletedCar = cars.splice(index, 1);
		res.send(deletedCar);
	}
	else {
		res.status(404).send("No car found");
	}
})

app.get("/carmaster", function(req, res) {
	let arr1 = carMaster;
	res.send(arr1);
});
