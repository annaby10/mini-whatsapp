const mongoose = require("mongoose");
const Chat = require("./models/chat"); // Adjust path if needed

async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
        console.log("MongoDB connection successful for seeding.");

        // Clear existing chats to avoid duplicates if you run this multiple times
        await Chat.deleteMany({});
        console.log("Existing chats deleted.");

        let allChats = [
            {
                from: "Neha",
                to: "Priya",
                msg: "Send me your exam sheets",
                created_at: new Date()
            },
            {
                from: "Rohan",
                to: "Noel",
                msg: "Where are you buddy?",
                created_at: new Date()
            },
            {
                from: "Ann",
                to: "Jerome",
                msg: "Let's go grab dinner!",
                created_at: new Date()
            },
            {
                from: "Sahiba",
                to: "Aditya",
                msg: "I told you nigga", // Consider if this language is appropriate for your application.
                created_at: new Date()
            }
        ];

        await Chat.insertMany(allChats);
        console.log("All chats inserted successfully!");
    } catch (err) {
        console.error("Error during seeding:", err);
    } finally {
        mongoose.connection.close(); // Close connection after seeding
        console.log("MongoDB connection closed.");
    }
}

main();