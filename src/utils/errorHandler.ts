export const errorHandler = (res: any, error: any) => {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  };
  