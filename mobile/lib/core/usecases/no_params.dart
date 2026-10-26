import 'package:equatable/equatable.dart';

/// Parameter object used when a UseCase requires no inputs.
class NoParams extends Equatable {
  @override
  List<Object?> get props => [];
}
