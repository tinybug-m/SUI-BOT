import bot from "../botInstance.js";

// Retry function
const retryOperation = async (ctx, handler, retries = 3, delay = 2000) => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      await handler(ctx); // Attempt to call the handler
      return; // If successful, return and exit
    } catch (err) {
      attempt++;
      console.error(`Attempt ${attempt} failed:`, err);

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));

      // If the last attempt fails, throw the error to handle it
      if (attempt === retries) {
        throw err;
      }
    }
  }
};

export const withErrorHandling = (handler) => {
  return async (ctx) => {
    try {
      // Try the operation with retry logic
      await retryOperation(ctx, handler);

    } catch (err) {
      console.error('Error handling callback query:', err);

      // Check for expired callback query error
      if (err.description && err.description.includes('query is too old')) {
        ctx.reply('Sorry, the operation timed out. Please try again.');
      } else {
        ctx.reply('Something went wrong, please try again later.');
      }

      // Send error details to the admin
      try {
        const errorMessage = `Error occurred in bot:\n\n${err.message}\nStack trace: ${err.stack}`;
        await bot.api.sendMessage(process.env.ADMIN_ID, `An error has occurred:\n\n${errorMessage}`);
      } catch (adminError) {
        console.error('Failed to send error message to admin:', adminError);
      }
    }
  };
};
