const { UserModel } = require('../models/user.model')
const ObjectID = require('mongoose').Types.ObjectId

module.exports.getAllUsers = async (req, resp) => {
  UserModel.find((err, docs) => {
    if (!err) resp.send(docs)
    else console.log('Error getting All users: ' + err)
  }).select('-password')
}

module.exports.userInfo = (req, resp) => {
  if (!ObjectID.isValid(req.params.id))
    return resp.status(400).send('ID is unknow : ' + req.params.id)

  UserModel.findById(req.params.id, (err, doc) => {
    resp.status(200).json(doc)
  })
}

module.exports.updateUser = async (req, resp) => {
  if (!ObjectID.isValid(req.params.id))
    return resp.status(400).send('ID is unknow : ' + req.params.id)

  try {
    await UserModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, upsert: true, setDefaultOnInsert: true },
      (err, doc) => {
        if (!err) resp.send(doc)
        else resp.status(500).json({ message: err })
      },
    )
  } catch (err) {
    return resp.status(500).json({ message: err })
  }
}

module.exports.deleteUser = async (req, resp) => {
  if (!ObjectID.isValid(req.params.id))
    return resp.status(500).send('Id unknown: ' + req.params.id)

  try {
    UserModel.findByIdAndRemove(req.params.id, (err) => {
      if (!err) resp.status(200).json({ message: 'Succesfully deleted. ' })
    })
  } catch (err) {
    return resp.status(500).json({ message: err })
  }
}

module.exports.follow = async (req, resp) => {
  console.log(req.body)
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToFollow)
  )
    return resp.status(500).send('Id unknown: ' + req.params.id)

  try {
    //add to the followers list
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { following: req.body.idToFollow } },
      { new: true },
      (err, doc) => {
        if (!err) resp.status(201).json(doc)
        else resp.status(400).json({ message: err })
      },
    )

    //add to the following list
    await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      {
        $addToSet: { followers: req.params.id },
      },
      (err) => {
        if (err) resp.status(400).json(err)
      },
    )
  } catch (err) {
    return resp.status(500).json({ message: err })
  }
}

module.exports.unfollow = async (req, resp) => {
  console.log(req.body)
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToUnfollow)
  )
    return resp.status(500).send('Id unknown: ' + req.params.id)

  try {
    //add to the followers list
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { following: req.body.idToUnfollow } },
      { new: true },
      (err, doc) => {
        if (!err) resp.status(201).json(doc)
        else resp.status(400).json({ message: err })
      },
    )

    //add to the following list
    await UserModel.findByIdAndUpdate(
      req.body.idToUnfollow,
      {
        $pull: { followers: req.params.id },
      },
      (err) => {
        if (err) resp.status(400).json(err)
      },
    )
  } catch (err) {
    return resp.status(500).json({ message: err })
  }
}
