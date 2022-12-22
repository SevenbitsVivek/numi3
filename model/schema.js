import mongoose from 'mongoose'

const signatureSchema = mongoose.Schema({
    message: String,
    ownerPrivateKey: String,
    messageHash: String,
    signedSignature: String
})

export const Signature = mongoose.model('signatures', signatureSchema)