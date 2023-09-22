import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { BleManager } from '@config-plugins/react-native-ble-plx';

const BluetoothComponent = () => {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);

  const manager = new BleManager();

  const scanDevices = () => {
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Scan error:', error);
        return;
      }
      if (!devices.some(existingDevice => existingDevice.id === device.id)) {
        setDevices(prevDevices => [...prevDevices, device]);
      }
    });
  };

  const connectToDevice = async device => {
    manager.stopDeviceScan();
    const connectedDevice = await manager.connectToDevice(device.id);
    setConnectedDevice(connectedDevice);
  };

  const disconnectDevice = () => {
    if (connectedDevice) {
      connectedDevice.cancelConnection();
      setConnectedDevice(null);
    }
  };

  useEffect(() => {
    return () => {
      manager.destroy();
    };
  }, []);

  return (
    <View>
      <Button title="Scan Devices" onPress={scanDevices} />
      <Button title="Disconnect" onPress={disconnectDevice} disabled={!connectedDevice} />

      {devices.length > 0 && (
        <FlatList
          data={devices}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View>
              <Text>{item.name || 'Unknown Device'}</Text>
              <Button
                title="Connect"
                onPress={() => connectToDevice(item)}
                disabled={!!connectedDevice}
              />
            </View>
          )}
        />
      )}

      {connectedDevice && (
        <View>
          <Text>Connected to: {connectedDevice.name || 'Unknown Device'}</Text>
          {/* Perform characteristic interactions here */}
        </View>
      )}
    </View>
  );
};

export default BluetoothComponent;
