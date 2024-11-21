import mongoose, { Document, Schema } from "mongoose";

interface Quote extends Document {
  text: string;
  author: string;
}

const quoteSchema = new Schema<Quote>({
  text: { type: String, required: true },
  author: { type: String, required: true },
});

const QuoteModel =
  mongoose.models.Quote || mongoose.model<Quote>("Quote", quoteSchema);

export default QuoteModel;
