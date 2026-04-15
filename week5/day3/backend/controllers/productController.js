const Product = require("../models/Product");
const Variant = require("../models/Variant");

exports.getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
      category,
      origin,
      flavor,
      qualities,
      caffeine,
      allergens,
      organic,
      minPrice,
      maxPrice,
      sort,
      search,
    } = req.query;

    const filter = {};

    if (category) filter.category = { $in: Array.isArray(category) ? category : [category] };
    if (origin) filter.origin = { $in: Array.isArray(origin) ? origin : [origin] };
    if (flavor) filter.flavor = { $in: Array.isArray(flavor) ? flavor : [flavor] };
    if (qualities) filter.qualities = { $in: Array.isArray(qualities) ? qualities : [qualities] };
    if (caffeine) filter.caffeine = { $in: Array.isArray(caffeine) ? caffeine : [caffeine] };
    if (allergens) filter.allergens = { $in: Array.isArray(allergens) ? allergens : [allergens] };
    if (organic === "true") filter.organic = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) filter.$text = { $search: search };

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    else if (sort === "price_desc") sortOption = { price: -1 };
    else if (sort === "name_asc") sortOption = { name: 1 };
    else if (sort === "name_desc") sortOption = { name: -1 };
    else if (sort === "rating") sortOption = { rating: -1 };
    else if (sort === "newest") sortOption = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const variants = await Variant.find({ product: product._id });
    res.json({ success: true, product, variants });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(3);

    res.json({ success: true, products: related });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    await Variant.deleteMany({ product: req.params.id });
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createVariant = async (req, res) => {
  try {
    const product = await Product.findById(req.body.product);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    const variant = await Variant.create(req.body);
    res.status(201).json({ success: true, variant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateVariant = async (req, res) => {
  try {
    const variant = await Variant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!variant) return res.status(404).json({ success: false, message: "Variant not found" });
    res.json({ success: true, variant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteVariant = async (req, res) => {
  try {
    const variant = await Variant.findByIdAndDelete(req.params.id);
    if (!variant) return res.status(404).json({ success: false, message: "Variant not found" });
    res.json({ success: true, message: "Variant deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFilterOptions = async (req, res) => {
  try {
    const [origins, flavors, qualities, caffeines, allergens, categories] = await Promise.all([
      Product.distinct("origin"),
      Product.distinct("flavor"),
      Product.distinct("qualities"),
      Product.distinct("caffeine"),
      Product.distinct("allergens"),
      Product.distinct("category"),
    ]);
    res.json({ success: true, filters: { origins, flavors, qualities, caffeines, allergens, categories } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
