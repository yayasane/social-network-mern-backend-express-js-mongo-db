const { UserModel } = require('../models/user.model')
const { PostModel } = require('../models/post.model')
const ObjectId = require('mongoose').Types.ObjectId

module.exports.readPost = (req, resp) => {
  PostModel.find((err, docs) => {
    if (!err) resp.status(200).send(docs)
    else console.log(err)
  }).sort({ createdAt: -1 })
}

module.exports.createPost = (req, resp) => {
  console.log('creating post')
  PostModel.create(
    {
      posterId: req.body.posterId,
      message: req.body.message,
      video: req.body.video,
      likers: [],
      comments: [],
    },
    (err, docs) => {
      if (!err)
        resp.status(200).json({ message: 'Succesfully created', post: docs })
      else console.log(err)
    },
  )
}

module.exports.updatePost = (req, resp) => {
  if (!ObjectId.isValid(req.params.id))
    return resp.status(400).send('ID is unknow : ' + req.params.id)

  const updatedRecord = {
    message: req.body.message,
  }

  PostModel.findByIdAndUpdate(
    req.params.id,
    { $set: updatedRecord },
    { new: true },
    (err, docs) => {
      if (!err) resp.status(200).send(docs)
      else console.log('Update error ' + err)
    },
  )
}

module.exports.deletePost = (req, resp) => {
  if (!ObjectId.isValid(req.params.id))
    return resp.status(400).send('ID is unknow : ' + req.params.id)

  PostModel.findByIdAndDelete(req.params.id, (err) => {
    if (!err) resp.status(200).json({ message: 'Succesfully deleted' })
    else console.log('Deleted error: ' + err)
  })
}

module.exports.likePost = async (req, resp) => {
  if (!ObjectId.isValid(req.params.id))
    return resp.status(400).send('ID is unknow : ' + req.params.id)

  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likers: req.body.id },
      },
      { new: true },
      (err, docs) => {
        if (err) return resp.status(400).send(err)
      },
    )

    await UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $addToSet: { likes: req.params.id },
      },
      { new: true },
      (err, docs) => {
        if (!err) resp.send(docs)
        else return resp.status(400).send(err)
      },
    )
  } catch (err) {
    return resp.status(400).send(err)
  }
}
module.exports.unlikePost = async (req, resp) => {
  if (!ObjectId.isValid(req.params.id))
    return resp.status(400).send('ID is unknow : ' + req.params.id)

  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likers: req.body.id },
      },
      { new: true },
      (err, docs) => {
        if (err) return resp.status(400).send(err)
      },
    )

    await UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $pull: { likes: req.params.id },
      },
      { new: true },
      (err, docs) => {
        if (!err) resp.send(docs)
        else return resp.status(400).send(err)
      },
    )
  } catch (err) {
    return resp.status(400).send(err)
  }
}

module.exports.commentPost = (req, resp) => {
  if (!ObjectId.isValid(req.params.id))
    return resp.status(400).send('ID is unknow : ' + req.params.id)

  try {
    PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) return resp.send(docs)
        else return resp.status(400).send(err)
      },
    )
  } catch (err) {
    return resp.status(400).send(err)
  }
}

module.exports.editCommentPost = (req, resp) => {
  if (!ObjectId.isValid(req.params.id))
    return resp.status(400).send('ID is unknow : ' + req.params.id)

  try {
    return PostModel.findById(req.params.id, (err, docs) => {
      const theComment = docs.comments.find((comment) =>
        comment._id.equals(req.body.commentId),
      )
      if (!theComment) return resp.status(404).send('Comment not found')

      theComment.text = req.body.text

      return docs.save((err) => {
        if (!err) return resp.status(200).send(docs)
        else return resp.status(500).send(err)
      })
    })
  } catch (err) {
    return resp.status(400).send(err)
  }
}

module.exports.deleteCommentPost = (req, resp) => {
  if (!ObjectId.isValid(req.params.id))
    return resp.status(400).send('ID is unknow : ' + req.params.id)

  try {
    return PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: {
            _id: req.body.commentId,
          },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) return resp.send(docs)
        else return resp.status(400).send(err)
      },
    )
  } catch (err) {
    return resp.status(400).send(err)
  }
}
