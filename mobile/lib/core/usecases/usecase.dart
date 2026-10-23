/// Base interface for all use cases in clean architecture.
abstract class UseCase<Type, Param> {
  Future<Type> call(Param param);
}
