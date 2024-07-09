const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signUp = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            mobile: req.body.mobile,
            isAdmin: req.body.isAdmin || false
        });

        const newUser = await user.save();
        res.status(201).json({ message: 'User Registration Successful!', data: newUser });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check for password
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Password' });
        }

        // Create token
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful!',
            data: {
                token: token,
                user: { id: user._id, email: user.email, name: user.name }
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const details = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        // Remove the password from the user object
        const { password, ...others } = user._doc;
        res.status(200).json({ message: 'User details fetched successfully', data: others });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// const updateDetails = async (req, res) => {
//     try {
//         const updates = req.body;

//         if (updates.password) {
//             updates.password = await bcrypt.hash(updates.password, 10);
//         }

//         const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
//         res.status(200).json({ message: 'User Details Updated', data: user });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// };


const updateDetails = async (req, res) => {
    const userId = req.user.id;
    const { name, email, mobile, password, isAdmin } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (password) user.password = await bcrypt.hash(password, 10);
        if (email) user.email = email;
        if (mobile) user.mobile = mobile;
        if (name) user.name = name;
        if (isAdmin) user.isAdmin = isAdmin;

        await user.save();
        res.status(200).json({ message: 'User details updated successfully!', data: user });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id; 
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = {
    signUp,
    login,
    details,
    updateDetails,
    deleteUser
};
