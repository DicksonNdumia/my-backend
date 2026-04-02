import bcrypt , { genSalt } from "bcryptjs";
import pool from "../config/db.config.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";

export const registerUser = async (req, res, next) => {
 try {
     
    const { name, email, password, role_id, age } = req.body;

  if(!name || !email || !password || !role_id || !age) {
    return res.status(401).json({
        message: "Please input everything"
    })
  }


  const roleCheck = await pool.query("SELECT id FROM roles WHERE id = $1", [role_id]);
    if (roleCheck.rows.length === 0) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

  const checkIfUserExist = await pool.query(
    `SELECT * FROM users WHERE email=$1`,
    [email]
  );
  if (checkIfUserExist.rows.length > 0) {
   return res.status(400).json({
      message: "user already exist ",
    });
  }
   const salt = await bcrypt.genSalt(10);
   const hashPassword = await bcrypt.hash(password, salt);


  const insertUser = await pool.query(
      `INSERT INTO users (name, email, password, role_id, age) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, email,role_id`, 
      [name, email, hashPassword, role_id, age]
    );

  const result = insertUser.rows[0];
  generateAccessToken(res, result.id, result.role_id);



 return res.status(201).json({
    message: "User created Successfully",
    data:result
  });
  
 } catch (error) {
    next(error)
 }

};
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    
    const userQuery = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    const user = userQuery.rows[0];
    //console.log("User from Database:", user);

    
    if (!user) {
      return res.status(404).json({ message: "User does not exist. Please register." });
    }

    
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

   
    const accessToken = generateAccessToken(user);
    //console.log("Token being generated for:", user.id, "with role:", user.role_id);
    const refreshToken = generateRefreshToken(user);

   
    return res.status(200).json({
      message: "Logged in successfully",
      accessToken,
      refreshToken,
      user: { id: user.id, role_id:user.role_id, name: user.name, email: user.email,} 
    });

  } catch (error) {
    next(error); 
  }
};

export const logoutUser = async(req,res, next) => {
    try {
        //We need immeadiately invalidate the access token and  the refresh token
    /**make it ampty by using the "" Quotes*/
    res.cookie("access_token", "", {
        httpOnly:true,
        secure:process.env.NODE_ENV !== "development",
        sameSite: "strict",
        expires:new Date(0) //Expires immeaditely
    });

    res.cookie("refresh_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        expires: new Date(0) // Expire immediately
    });

    res.status(200).json({ message: "User logged out successfully" });

    } catch (error) {
        next(error)
        
    }
}

export const getAllUsers = async (req, res, next) => {
  try {
    const userDetails = await pool.query(`
      SELECT users.id, users.name, users.email, roles.name 
      FROM users 
      LEFT JOIN roles ON users.role_id = roles.id
    `);

    const users = userDetails.rows;

    
    if (users.length === 0) {
      return res.status(404).json({
        message: "No users found in the database",
      });
    }

    
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUsers = async(req,res,next) => {
  try {
    const {id} = req.params;


  const checkIfUserExist = await pool.query(`SELECT id FROM users WHERE id = $1`,[id]);
  if(checkIfUserExist.rows.length === 0){
    return res.status(400).json({
      message: "User not found"
    });
  }

  //if user is found continue
  const deleteUser = await pool.query(`DELETE FROM  users WHERE id=$1 RETURNING id,role_id,name,email`,[id]);
  const result = deleteUser.rows[0];

 return res.status(200).json({
    message: "User deleted Successfully",
    user: result
  });
  } catch (error) {
    next(error)
  }
}

export const getUserById = async(req,res,next) => {
  try {
    const {id} = req.params;
   


  const checkIfUserExist = await pool.query(`SELECT id FROM users WHERE id = $1`,[id]);
  if(checkIfUserExist.rows.length === 0){
    return res.status(400).json({
      message: "User not found"
    });
  }

  //Bring back the user using the Id
  const getUser = await pool.query(`SELECT * FROM users WHERE id=$1  `,[id]);
  const result = getUser.rows[0]

  res.status(200).json({
    message: "Your User is here",
    data: {
      id: result.id,
      name: result.name,
      email: result.email,
      role: result.role_id,
      age: result.age
    }
  })


  } catch (error) {
    next(error)
  }

}

