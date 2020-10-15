const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

module.exports = {
    signup,
    login
};

async function signup(req, res) {
    const user = new User(req.body);
    try {
        await user.save();
        const token = createJWT(user);
        res.json({token});
    } catch(err) {
        res.status(400).json(err);
    }
}

async function login(req, res) {
    try {
        const user = await User.findOne({email: req.body.email});
        if (!user) return res.status(401).json({err: 'invalid email'});
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (isMatch) {
                const token = createJWT(user);
                res.json({token});
            } else {
                return res.status(401).json({err: 'invalid password'});
            }
        });
    } catch (err) {
        return res.status(401).json(err);
    }
}

/*---Helper Functions---*/
function createJWT(user) {
    return jwt.sign(
        {user},
        SECRET,
        {expiresIn: '1h'}
    );
}