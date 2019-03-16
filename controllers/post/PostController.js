const hdate = require('human-date');

const { check } = require('express-validator/check');

const Post = require('../../models/Post');

exports.createPost = (req, res, next) => {
	const url = req.protocol + "://" + req.get("host");
	const post = new Post({
		title: req.body.title,
		content: req.body.content,
		image: url + "/images/" + req.file.filename,
		creator: req.userData.userId,
		created: Date.now().toString()
	});
	post.save()
		.then(createdPost => {
			res.status('201').json({
				message: 'Post added successfully!',
				post: {
					...createdPost,
					id: createdPost._id
				}
			})
		})
		.catch(err => {
			res.status(500).json({
				message: "Creating post failed!"
			});
		});
}

exports.updatePost = (req, res, next) => {
	let imagePath = req.body.image;
	if (req.file) {		
		const url = req.protocol + "://" + req.get("host");
		imagePath = url + "/images/" + req.file.filename;
	}
	
	const post = new Post({
		_id: req.body.id,
		title: req.body.title,
		content: req.body.content,
		image: imagePath,
		creator: req.userData.userId
	});

	Post.updateOne({ _id: req.params.id, creator: req.userData.userId}, post)
		.then(updatedPost => {
				if (updatedPost.n > 0) {
					res.status('201').json({
						message: 'Post updated successfully!'
					});
				} else {
					res.status('401').json({
						message: 'Unauthorized action!'
					});
				}	
			})
			.catch(err => {
				res.status(500).json({
					message: "Updating post failed!"
				});
			});
}

exports.getPosts = (req, res, next) => {
	const pageSize = +req.query.pagesize;
	const currentPage = +req.query.page;
	let fetchedPosts;
	const postQuery = Post.find().sort('-created');
	if (pageSize && currentPage) {
		postQuery
			.skip(pageSize * (currentPage - 1))
			.limit(pageSize)
			.lean();
	}
	postQuery
		.then(documents => {
			fetchedPosts = documents;
			return Post.count();
		})
		.then(count => {
			res.status(200).json({
			message: "Posts fetched successfully!",
			posts: fetchedPosts,
			maxPosts: count
		})
		.catch(err => {
			res.status(500).json({
				message: "Something went wrong!"
			});
		});
	});
}

exports.getPost = (req, res, next) => {
	Post.findById(req.params.id)
		.then(post => {
			if (post) {
				console.log(post);
				res.status(200).json(post);
			} else {
				res.status(404).json({ 
					message: "Cannot find specified post!" 
				});
			}
		})
		.catch(err => {
			console.log(err.message);
		});
}

exports.deletePost = (req, res, next) => {
	Post.deleteOne({ _id: req.params.id })
		.then(result => {
			if (result.n > 0) {
				res.status('201').json({
					message: 'Post deleted successfully!'
				});
			} else {
				res.status('401').json({
					message: 'Unauthorized action!'
				});
			}
		})
		.catch(err => {
			res.status(500).json({
				message: "Deleting post failed!"
			});
		});
}