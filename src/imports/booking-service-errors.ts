#13 0.739
#13 4.508 src/modules/booking/booking.service.ts:43:46 - error TS2769: No overload matches this call.
#13 4.508   Overload 1 of 3, '(entityLikeArray: DeepPartial<Booking>[]): Booking[]', gave the following error.
#13 4.508     Object literal may only specify known properties, and 'userId' does not exist in type 'DeepPartial<Booking>[]'.
#13 4.508   Overload 2 of 3, '(entityLike: DeepPartial<Booking>): Booking', gave the following error.
#13 4.508     Argument of type '{ userId: string; bookingReference: string; flightPrice: number; hotelPrice: number; carPrice: number; subtotal: number; tax: number; total: number; status: BookingStatus.PENDING_APPROVAL; type: string; ... 5 more ...; projectCode?: string; }' is not assignable to parameter of type 'DeepPartial<Booking>'.
#13 4.508       Type '{ userId: string; bookingReference: string; flightPrice: number; hotelPrice: number; carPrice: number; subtotal: number; tax: number; total: number; status: BookingStatus.PENDING_APPROVAL; type: string; ... 5 more ...; projectCode?: string; }' is not assignable to type '{ id?: string | undefined; bookingReference?: string | undefined; userId?: string | undefined; user?: DeepPartial<User> | undefined; type?: DeepPartial<BookingType> | undefined; ... 23 more ...; payments?: DeepPartial<...> | undefined; }'.
#13 4.508         Types of property 'type' are incompatible.
#13 4.508           Type 'string' is not assignable to type 'DeepPartial<BookingType> | undefined'.
#13 4.508
#13 4.508 43       const booking = this.bookingRepository.create({
#13 4.508                                                 ~~~~~~
#13 4.508
#13 4.508 src/modules/booking/booking.service.ts:61:33 - error TS2339: Property 'id' does not exist on type 'Booking[]'.
#13 4.508
#13 4.508 61         bookingId: savedBooking.id,
#13 4.508                                    ~~
#13 4.508 src/modules/booking/booking.service.ts:69:33 - error TS2339: Property 'id' does not exist on type 'Booking[]'.
#13 4.508
#13 4.508 69         bookingId: savedBooking.id,
#13 4.508                                    ~~
#13 4.508 src/modules/booking/booking.service.ts:73:7 - error TS2740: Type 'Booking[]' is missing the following properties from type 'Booking': id, bookingReference, userId, user, and 25 more.
#13 4.508
#13 4.508 73       return savedBooking;
#13 4.508          ~~~~~~
#13 4.508 src/modules/health/health.controller.ts:9:8 - error TS2307: Cannot find module '@nestjs/terminus' or its corresponding type declarations.
#13 4.508
#13 4.508 9 } from '@nestjs/terminus';
#13 4.508          ~~~~~~~~~~~~~~~~~~
#13 4.508 src/modules/health/health.module.ts:2:32 - error TS2307: Cannot find module '@nestjs/terminus' or its corresponding type declarations.
#13 4.508
#13 4.508 2 import { TerminusModule } from '@nestjs/terminus';
#13 4.508                                  ~~~~~~~~~~~~~~~~~~
#13 4.508 src/modules/health/health.module.ts:3:28 - error TS2307: Cannot find module '@nestjs/axios' or its corresponding type declarations.
#13 4.508
#13 4.508 3 import { HttpModule } from '@nestjs/axios';
#13 4.508                              ~~~~~~~~~~~~~~~
#13 4.508 src/modules/kafka/kafka-consumer.service.ts:19:17 - error TS2322: Type 'string | undefined' is not assignable to type 'string'.
#13 4.508   Type 'undefined' is not assignable to type 'string'.
#13 4.508
#13 4.508 19       brokers: [this.configService.get('KAFKA_BROKER')],
#13 4.508                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
#13 4.508 src/modules/kafka/kafka-consumer.service.ts:27:7 - error TS2322: Type 'string | undefined' is not assignable to type 'string'.
#13 4.508   Type 'undefined' is not assignable to type 'string'.
#13 4.508
#13 4.508 27       groupId: this.configService.get('KAFKA_GROUP_ID'),
#13 4.508          ~~~~~~~
#13 4.508
#13 4.508   node_modules/kafkajs/types/index.d.ts:153:3
#13 4.508     153   groupId: string
#13 4.508           ~~~~~~~
#13 4.508     The expected type comes from property 'groupId' which is declared here on type 'ConsumerConfig'
#13 4.508 src/modules/kafka/kafka-producer.service.ts:18:17 - error TS2322: Type 'string | undefined' is not assignable to type 'string'.
#13 4.508   Type 'undefined' is not assignable to type 'string'.
#13 4.508
#13 4.508 18       brokers: [this.configService.get('KAFKA_BROKER')],
#13 4.508                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
#13 4.508 src/modules/payment/services/paystack.service.ts:16:5 - error TS2322: Type 'string | undefined' is not assignable to type 'string'.
#13 4.508   Type 'undefined' is not assignable to type 'string'.
#13 4.508
#13 4.508 16     this.secretKey = this.configService.get('PAYSTACK_SECRET_KEY');
#13 4.508        ~~~~~~~~~~~~~~
#13 4.508 src/modules/users/users.service.ts:41:44 - error TS2322: Type 'string | null' is not assignable to type 'string | (() => string) | undefined'.
#13 4.508   Type 'null' is not assignable to type 'string | (() => string) | undefined'.     
#13 4.508
#13 4.508 41     await this.userRepository.update(id, { refreshToken });
#13 4.508                                               ~~~~~~~~~~~~
#13 4.508
#13 4.508   src/modules/users/entities/user.entity.ts:83:3
#13 4.508     83   refreshToken: string;
#13 4.508          ~~~~~~~~~~~~
#13 4.508     The expected type comes from property 'refreshToken' which is declared here on type '_QueryDeepPartialEntity<User>'
#13 4.508
#13 4.509 Found 12 error(s).
#13 4.509
#13 ERROR: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1
------
 > [development 6/6] RUN npm run build:
4.508 41     await this.userRepository.update(id, { refreshToken });
4.508                                               ~~~~~~~~~~~~
4.508
4.508   src/modules/users/entities/user.entity.ts:83:3
4.508     83   refreshToken: string;
4.508          ~~~~~~~~~~~~
4.508     The expected type comes from property 'refreshToken' which is declared here on type '_QueryDeepPartialEntity<User>'
4.508
4.509 Found 12 error(s).