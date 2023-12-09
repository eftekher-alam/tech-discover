// https://github.com/programming-hero-web-course1/b8a12-server-side-eftekher-alam.git
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser')
const app = express();
const prot = process.env.PORT || 5000;

// middleware
app.use(cors({
    origin: [process.env.liveClient, process.env.localClient],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());


const uri = process.env.uri;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const verifyToken = (req, res, next) => {
    const token = req?.cookies?.token;
    // console.log("client send token: ", token);
    if (!token) {
        return res.status(401).send({ message: "unauthorized access, no token" }); // 401 means there is no token
    }
    jwt.verify(token, process.env.secretKey, (err, decoded) => {
        if (err) {
            res.status(401).send({ message: "unauthorized access, invalid token" });
        }
        // console.log("decoded", decoded);
        req.decodedUser = decoded  //it included an extra data to the req
        next();
    })
}



async function run() {
    try {
        //Database and collections
        const db = client.db("techDiscoverDB");
        const usersCollection = db.collection("users");
        const productCollection = db.collection("products");
        const voteCollection = db.collection("votes");
        const reviewCollection = db.collection("reviews");

        /*
        =======================================
                        Users 
        =======================================
        */
        const verifyAdmin = async (req, res, next) => {
            const reqUserEmail = req.decodedUser.email;
            const userFilter = { email: reqUserEmail };
            const user = await usersCollection.findOne(userFilter);

            // console.log(user);

            if (user?.role !== "Admin") {
                console.log("the user is not admin");
                return res.status(403).send({ message: "forbidden access" })
            }

            console.log("the user is admin");
            next();
        }

        // Store user in database
        app.post("/user", async (req, res) => {
            const user = req.body;

            //set default role is user
            user.role = "User";

            const query = { uid: user?.uid };
            const userExist = await usersCollection.findOne(query);
            if (userExist)
                return;

            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        // Admin | Delete user from database
        app.delete("/admin/user/:email", verifyToken, verifyAdmin, async (req, res) => {
            const userEmail = req.params.email;

            if (userEmail == "admin@gmail.com")
                return res.status(403).send({ message: "forbidden access" })

            const userFilter = { email: userEmail }
            const result = await usersCollection.deleteOne(userFilter);
            if (result.deletedCount === 1) {
                return res.send({ success: true });
            }
            else {
                return res.send({ success: false })
            }
        })

        // admin | Get users
        app.get("/admin/users", verifyToken, verifyAdmin, async (req, res) => {
            const users = await usersCollection.find().toArray();
            res.send(users);
        })

        // admin | Change user role
        app.patch("/admin/user-role-change", verifyToken, verifyAdmin, async (req, res) => {
            const userEmail = req.query.email;
            const newRole = req.query.role;

            if (userEmail == "admin@gmail.com")
                return res.status(403).send({ message: "forbidden access" })

            const userFilter = { email: userEmail }
            const updatedUser = {
                $set: { role: newRole },
            }
            const result = await usersCollection.updateOne(userFilter, updatedUser);
            if (result.modifiedCount === 1) {
                return res.send({ success: true });
            }
            else {
                return res.send({ success: false })
            }
        })

        // Get users role
        app.get("/user-role/:email", verifyToken, async (req, res) => {
            const userEmail = req.params.email;

            // console.log(`${userEmail} !== ${req?.decodedUser?.email}`);

            if (userEmail !== req?.decodedUser?.email)
                return res.status(403).send({ message: "forbidden access" });

            const userFilter = { email: userEmail }

            const users = await usersCollection.findOne(userFilter);

            res.send(users.role);
        })

        //generate and set token to browser
        app.post("/jwt", async (req, res) => {
            const user = req.body;
            // console.log("Logged user : ", user);
            const token = jwt.sign(user, process.env.secretKey, { expiresIn: "1h" })
            res
                .cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',

                })
                .send({ success: true });
        })

        //Clear token when user logged out.\
        app.post('/clearToken', async (req, res) => {
            const user = req.body;
            // console.log('logging out', user);
            res
                .clearCookie('token', { maxAge: 0, sameSite: 'none', secure: true })
                .send({ success: true })
        })


        /*
        =======================================
                        Products 
        =======================================
        */
        //Get sorted products array where pending will be at the beginning
        app.get("/prod-review-queue", verifyToken, async (req, res) => {
            const products = await productCollection.find().toArray();

            // Function to sort the array based on status
            function sortArray(array) {
                return array.sort((a, b) => {
                    if (a.status === 'pending') {
                        return -1;
                    }
                    if (b.status === 'pending') {
                        return 1;
                    }
                    return 0;
                });
            }

            // Call the function to sort the array
            let sortedProducts = sortArray(products);

            // Output the sorted array
            res.send(sortedProducts);

        })


        app.patch("/admin/prod-status-change", verifyToken, async (req, res) => {
            const productId = req.query.productId;
            const newStatus = req.query.status;

            console.log(productId, newStatus);

            const productFilter = { _id: new ObjectId(productId) };
            const updatedProduct = {
                $set: {
                    status: newStatus
                },
            }
            const result = await productCollection.updateOne(productFilter, updatedProduct);
            if (result.modifiedCount === 1) {
                return res.send({ success: true });
            }
            else {
                return res.send({ success: false })
            }
        })


        //Make product as featured 
        app.patch("/admin/prod-make-featured", verifyToken, async (req, res) => {
            const productId = req.query.productId;
            const isFeatured = req.query.featured;
            // console.log(productId, featured);

            const productFilter = { _id: new ObjectId(productId) };

            const updatedProduct = {
                $set: {
                    featured: isFeatured
                },
            }
            const result = await productCollection.updateOne(productFilter, updatedProduct);



            if (result.modifiedCount === 1) {
                return res.send({ success: true });
            }
            else {
                return res.send({ success: false })
            }
        })


        app.get("/featured-products", async (req, res) => {
            const featuredProductFilter = { $and: [{ "featured": "isFeatured" }, { "status": "approve" }] };
            const featuredProducts = await productCollection.find(featuredProductFilter).toArray();
            return res.status(200).send(featuredProducts.slice(0, 4));
        })


        app.get("/products", async (req, res) => {
            const productFilter = { status: "approve" };
            const products = await productCollection.find(productFilter).toArray();
            res.status(200).send(products);
        })

        app.get("/products/:id", async (req, res) => {
            const firebaseUserId = req.params.id;
            const productFilter = { ownerFirebaseId: firebaseUserId };
            const products = await productCollection.find(productFilter).toArray();
            res.status(200).send(products);
        })

        app.post("/product", verifyToken, async (req, res) => {
            let newProduct = req.body;
            console.log(newProduct);
            const result = await productCollection.insertOne(newProduct);
            if (result.insertedId) {
                return res.send({ success: true });
            }
            return res.send({ success: false });
        })

        //update single product 
        app.put("/product/:id", verifyToken, async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const productFilter = { _id: new ObjectId(req.params.id) };
            const updatedProduct = {
                $set: { ...newProduct },
            }
            const result = await productCollection.updateOne(productFilter, updatedProduct);
            if (result.modifiedCount === 1) {
                return res.send({ success: true });
            }
            else {
                return res.send({ success: false })
            }
        })

        //Get single product by productId
        app.get("/product/:id", verifyToken, async (req, res) => {
            const productFilter = { _id: new ObjectId(req.params.id) };
            const product = await productCollection.findOne(productFilter);
            res.send(product);
        })

        //Delete single product by productId
        app.delete("/product/:id", verifyToken, async (req, res) => {
            const productFilter = { _id: new ObjectId(req.params.id) };
            const result = await productCollection.deleteOne(productFilter);
            if (result.deletedCount === 1)
                return res.send({ success: true });
            return res.send({ success: false })
        })



        app.get("/trending-products", async (req, res) => {
            const featuredProducts = await productCollection.find().sort({ upvote: -1 }).toArray();
            return res.status(200).send(featuredProducts.slice(0, 8));
        })

        app.get("/search-products", async (req, res) => {
            const searchString = req.query.search.toUpperCase();
            const products = await productCollection.find().toArray();
            const filterProducts = products.filter(product => {
                const productString = product.tags.toString() + product.productName;
                return productString.toUpperCase().includes(searchString);
            })
            res.send(filterProducts);
        })

        /*
       =======================================
                       Vote 
       =======================================
       */

        app.get("/vote-info", verifyToken, async (req, res) => {
            const productId = req.query.productId;
            const firebaseUserId = req.query.firebaseUserId;
            // console.log(productId, firebaseUserId);

            const voteFilter = { $and: [{ "firebaseUserId": firebaseUserId }, { "productId": productId }] };
            const voteInfo = await voteCollection.findOne(voteFilter);
            if (voteInfo) {
                return res.send(voteInfo.typeOfVote)
            }
            else
                return res.send("noVote");
        })


        //vote manager
        app.post("/vote", async (req, res) => {
            const { productId, typeOfVote, firebaseUserId, upVote, downVote } = req.body;
            let result = "";
            // console.log(upVote, downVote, typeOfVote);

            const productFilter = { _id: new ObjectId(productId) };
            const updateProduct = {
                $set: {
                    upvote: upVote,
                    downvote: downVote
                },
            };

            const userFilter = { uid: firebaseUserId };
            const userData = await usersCollection.findOne(userFilter);

            const voteFilter = { $and: [{ "firebaseUserId": firebaseUserId }, { "productId": productId }] };
            const options = { upsert: true };
            const updateVote = {
                $set: {
                    userId: userData._id.toString(),
                    typeOfVote: typeOfVote
                },
            };

            if (typeOfVote === "upVote") {
                result = await voteCollection.updateOne(voteFilter, updateVote, options);
                await productCollection.updateOne(productFilter, updateProduct);
            }
            else if (typeOfVote === "downVote") {
                result = await voteCollection.updateOne(voteFilter, updateVote, options);
                await productCollection.updateOne(productFilter, updateProduct);

            }
            else if (typeOfVote === "noVote") {
                result = await voteCollection.deleteOne(voteFilter);
                await productCollection.updateOne(productFilter, updateProduct);
            }

            if (result.deletedCount === 1 || result.modifiedCount === 1 || result.upsertedId) {
                return res.send({ message: 'success' });
            }
            else {
                return res.send({ message: 'failed' })
            }
        })

        /*
        =======================================
                       review 
        =======================================
        */

        //Check permission that a user can post review or not
        app.get("/reviewPermission", async (req, res) => {
            const firebaseUserId = req.query?.firebaseUserId;
            const productId = req.query?.productId;

            const reviewFilter = { $and: [{ "firebaseUserId": firebaseUserId }, { "productId": productId }] };
            const review = await reviewCollection.findOne(reviewFilter);

            if (review) {
                return res.send({ success: false });
            }
            else
                return res.send({ success: true });
        })

        //Get all the reviews
        app.get("/reviews", async (req, res) => {
            const productId = req.query.productId;

            const reviewFilter = { productId: productId };
            const reviews = await reviewCollection.find(reviewFilter).toArray();

            res.send(reviews || []);
        })

        //Store review
        app.post("/review", async (req, res) => {
            const { firebaseUserId, productId, rating, review } = req.body;

            const query = { uid: firebaseUserId };
            const user = await usersCollection.findOne(query);
            const userId = user?._id.toString();
            const username = user?.displayName;


            const date = new Date();
            const reviewInfo = {
                userId,
                firebaseUserId,
                username,
                reviewDate: `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`,
                productId,
                rating,
                review
            }
            const result = await reviewCollection.insertOne(reviewInfo);

            if (result?.insertedId)
                res.send({ success: true });
        })

    } finally {

    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Server is running");
})

app.listen(prot, () => {
    console.log(`Tech Discover server is running on port ${prot}`);
})