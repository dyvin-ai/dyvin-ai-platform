import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RoboticsService {
  private readonly logger = new Logger(RoboticsService.name);

  async getRoboticsStatus() {
    return {
      connectedControllers: ['IoT_EDGE_GATEWAY_1', 'INDUSTRIAL_CONTROLLER_ALPHA'],
      protocolSupport: ['MQTT', 'ROS2', 'OPC_UA', 'MODBUS'],
      sandboxStatus: 'ISOLATED_HARDWARE_EMULATION',
    };
  }
}
