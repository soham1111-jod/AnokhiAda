const Product = require("../models/AddPost");
const Banners = require("../models/AddBanner");
const Category = require("../models/AddCategory");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({
      message: "successfull",
      categories: categories,
    });
  } catch (e) {
    res.status(400).send("failed: " + e.message);
  }
};

const getProducts = async (req, res) => {
  try {
    const {
      search,
      category, // this is the slug!
      minPrice,
      maxPrice,
      sortBy,
      sortOrder = "asc",
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Step 1: Search
    if (search) {
      query.$or = [
        { Product_name: { $regex: search, $options: "i" } },
        { Product_discription: { $regex: search, $options: "i" } },
      ];
    }

    // ✅ Step 2: Category filtering using slug
    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (!categoryDoc) {
        return res.status(400).json({ message: "Invalid category slug" });
      }
      query.Product_category = categoryDoc._id;
    }

    // Step 3: Price range
    if (minPrice || maxPrice) {
      query.Product_price = {};
      if (minPrice) query.Product_price.$gte = Number(minPrice);
      if (maxPrice) query.Product_price.$lte = Number(maxPrice);
    }

    // Step 4: Sorting
    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    // Step 5: Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(query)
      .populate("Product_category") // optional
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.status(200).json({
      message: "successfull",
      products,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (e) {
    res.status(400).json({
      message: "failed: " + e.message,
    });
  }
};

const getBanner = async (req, res) => {
  try {
    const banners = await Banners.find({});
    res.status(200).json({
      message: "sucessfull",
      banners: banners,
    });
  } catch (e) {
    res.status(400).json({
      message: "failed: " + e.message,
    });
  }
};

const getAllData = async (req, res) => {
  try {
    const products = await Product.find({});
    const banners = await Banners.find({});
    const categoriesRaw = await Category.find({});

    // Transform categories to include standardized keys
    const categories = categoriesRaw.map(cat => ({
      _id: cat._id,
      name: cat.category,
      image: cat.category_image,
      description: cat.category_description,
      slug: cat.category?.toLowerCase().replace(/\s+/g, "-") || cat._id.toString(),
    }));

    const response = {
      products,
      banners,
      categories,
    };

    res.status(200).json({
      message: "success",
      data: response,
    });
  } catch (e) {
    res.status(400).json({
      message: "failed: " + e.message,
    });
  }
};


const getProductsBySlug = async (req, res) => {
  try {
    const { category } = req.query;

    console.log("👉 Received category slug:", category);

    if (!category) {
      return res.status(400).json({ message: "Missing category slug" });
    }

    const categoryDoc = await Category.findOne({ slug: category });
    console.log("✅ Found category document:", categoryDoc);

    if (!categoryDoc) {
      return res.status(400).json({ message: "Invalid category slug" });
    }

    const products = await Product.find({ Product_category: categoryDoc._id })
      .populate("Product_category", "category category_description")
      .lean();

    console.log("✅ Found products:", products.length);

    const transformed = products.map((product) => ({
      ...product,
      Product_category:
        product.Product_category?.category || product.Product_category,
    }));

    res.status(200).json({
      message: "Products by category fetched",
      product: transformed,
    });
  } catch (e) {
    console.error("❌ Error in getProductsBySlug:", e); // Add this!
    res.status(500).json({ message: "Error: " + e.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "Missing product ID" });
    }

    const product = await Product.findById(id).populate("Product_category");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (e) {
    res.status(500).json({ message: "Error: " + e.message });
  }
};




module.exports = {
  getCategories,
  getProducts,
  getBanner,
  getAllData,
  getProductsBySlug, // ✅ Add this line
  getProductById, // ✅ Add this line
};


