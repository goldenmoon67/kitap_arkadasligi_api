

async function authenticate(req, res, next) {//TODO::IT will be used for every call
    const idToken = req.headers.authorization;

    if (!idToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decodedToken = await fb.admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Forbidden' });
    }
}

