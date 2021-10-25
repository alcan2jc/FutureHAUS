import paho.mqtt.client as mqtt
import threading
import random
import json
import random

def on_subscribe(client, userdata, mid, granted_qos):
    print("subscribed")

def on_message(mosq, obj, msg):
    print(msg.payload)

def on_connect(client, userdata, flags, rc):
    print("Connection attempt returned: " + mqtt.connack_string(rc)) # mqtt !!

def on_disconnect():
    print("disconnected")

# Paste code below after results in main.
client = mqtt.Client("FutureHAUS", transport="websockets")
client.on_subscribe = on_subscribe
client.on_message = on_message
client.on_connect = on_connect
client.on_disconnect = on_disconnect
# client.connect("192.168.0.160", port=9001)  # choose your ip and port
client._username = "username"
client._password = "FutureHAUS"
client.connect("10.0.0.115", port=9001)  # choose your ip and port
# print(client.subscribe("dev/test", 0))


def sendVoltage():
    topic = "FutureHAUS/Website/Battery"
    threading.Timer(2.0, sendVoltage).start()
    results =  {
        'DC_Output_Voltage': str((random.random() * 22.6) + 30) + " V",
        'PV_POWER': str((random.random() * 22.6) + 30) + " W",
        'PV_CURRENT': str((random.random() * 22.6) + 30) + " A",
        'PV_Voltage': str((random.random() * 22.6) + 30) + " V",
        }

    results = json.dumps(results)
    client.publish(topic, results)


def sendPower():
    topic = "FutureHAUS/Website/Power"
    threading.Timer(2.0, sendPower).start()
    results = (random.random() * 22.6) + 30
    client.publish(topic, results)


def sendResults():

    topic = "FutureHAUS/Website/Consumption"
    threading.Timer(2.0, sendResults).start()
    results = {
        "ct0_power": -(random.random() * 22.6 + 30),
        "ct1_power": -(random.random() * 22.6 + 30),
    }
    results = json.dumps(results)
    client.publish(topic, results)

sendVoltage()
# sendPower()
sendResults()
# client.publish("dev/test", "yo")
# client.loop_forever()