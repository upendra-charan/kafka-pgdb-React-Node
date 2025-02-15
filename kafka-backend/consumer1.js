const express = require('express');
const { Kafka } = require('kafkajs');
const cors = require('cors');

const app = express();
const port = 5005;  // Running on a different port

// Enable CORS
app.use(cors());

// Kafka setup
const kafka = new Kafka({
  clientId: 'consumer-1',
  brokers: ['localhost:9092'],  // Kafka broker
});

const consumer = kafka.consumer({ groupId: 'consumer-group-1' });

let messages = [];

// Function to start consumer
const startConsumer = async () => {
  await consumer.connect();
  console.log(`Consumer 1 connected to Kafka`);

  await consumer.subscribe({ topic: 'react-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Consumer 1 received: ${message.value.toString()}`);
      messages.push(message.value.toString());
    },
  });
};

// API to fetch consumed messages
app.get('/messages', (req, res) => {
  res.json({ messages });
});

// Start Kafka consumer
startConsumer().catch(console.error);

// Start Express server
app.listen(port, () => {
  console.log(`Consumer 1 running on http://localhost:${port}`);
});
