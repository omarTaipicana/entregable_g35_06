const catchError = require("../utils/catchError");
const Image = require("../models/Image");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

const getAll = catchError(async (req, res) => {
  const results = await Image.findAll();
  return res.json(results);
});

const create = catchError(async (req, res) => {
    if (!req.file) return res.status(400).json({message:"Debes cargar una imagen"})
  const { url } = await uploadToCloudinary(req.file);
  const { hotelId } = req.body;
  const result = await Image.create({
    url,
    hotelId,
  });
  return res.status(201).json(result);
});

const getOne = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await Image.findByPk(id);
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

const remove = catchError(async (req, res) => {
    const { id } = req.params;
    const image = await Image.findByPk(id);
    if (!image) return res.status(400).json({ message: "no existe id" });
    await deleteFromCloudinary(image.url);
    await image.destroy();
    return res.sendStatus(204);
  });
  


module.exports = {
  getAll,
  create,
  getOne,
  remove,
};
