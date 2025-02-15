const express = require('express');
const bodyParser = require('body-parser');
const { Kafka, Partitioners } = require('kafkajs');
const cors = require('cors');
const app = express();
const port = 5000;

// Enable CORS for all routes
app.use(cors());  // This allows all origins by default
app.use(bodyParser.json());

// Kafka setup
const kafka = new Kafka({
  clientId: 'react-kafka-client',
  brokers: ['localhost:9092'],  // Kafka broker address
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner
});

const consumer = kafka.consumer({ groupId: 'react-group' });

// Variable to store consumed messages
let messages = [];

console.log("messages", messages)

// Connect the producer
const connectProducer = async () => {
  await producer.connect();
  console.log("Producer connected to Kafka");
};

// Connect the consumer and start consuming messages
const startConsumer = async () => {
  // messages = [];
  await consumer.connect();
  console.log("Consumer connected to Kafka");

  // Subscribe to the topic
  await consumer.subscribe({ topic: 'react-topic', fromBeginning: true });

  // Run the consumer and handle incoming messages
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message: ${message.value.toString()}`);
      messages.push(message.value.toString());  // Store the consumed message in memory
    },
  });
};

// Clear the messages array manually
app.post('/clear-messages', (req, res) => {
  messages = [];  // Clear the array
  console.log("Messages array cleared");
  res.status(200).json({ status: "Messages cleared successfully" });
});

// Producer Route (to send messages)
app.post('/send', async (req, res) => {
  const { message } = req.body;

  try {
    await producer.send({
      topic: 'react-topic',
      messages: [{ value: message }],
    });
    // messages = [];

    res.status(200).json({ status: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending message to Kafka' });
  }
});

// Handle GET request for consumed messages from Kafka
app.get('/messages', (req, res) => {
  res.json({ messages });  // Return stored messages to React app
});

// Start the Kafka consumer and producer
const startKafka = async () => {
  await connectProducer();
  await startConsumer();
};

// Start Kafka and the server
startKafka().catch(console.error);

// Start the Express server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
