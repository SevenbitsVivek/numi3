import { Signature } from '../model/schema.js'
import ethers from 'ethers'

//create signature
export const createSignature = async (req, res) => {
    try {
        const { message, privateKey } = req.body
        const newSignature = new Signature({
            privateKey
        })
        const signer = new ethers.Wallet(privateKey);
        let Message = message + Date.now();
        let messageHash = ethers.utils.id(Message);
        let messageBytes = ethers.utils.arrayify(messageHash);
        let signatures = await signer.signMessage(messageBytes);
        newSignature.messageHash = messageHash
        newSignature.signedSignature = signatures
        const existingSignature = await Signature.findOne({ messageHash })
        if (existingSignature) {
            return res.status(404).json({
                success: false,
                message: 'Invalid Signature',
            })
        } else {
            newSignature.save(async (_, signature) => {
                res.status(201).json({
                    data: signature,
                    success: true,
                    message: 'Signature created successfully'
                })
            })
        }
    } catch (error) {
        return res.status(409).json({ error: error.message })
    }
}