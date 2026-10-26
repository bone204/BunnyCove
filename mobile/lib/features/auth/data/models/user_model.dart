import 'package:equatable/equatable.dart';

/// User data model representing a player burrow identity.
class UserModel extends Equatable {
  final String id;
  final String username;
  final String displayName;
  final String email;
  final String? avatarUrl;

  const UserModel({
    required this.id,
    required this.username,
    required this.displayName,
    required this.email,
    this.avatarUrl,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as String? ?? '',
      username: json['username'] as String? ?? '',
      displayName: json['displayName'] as String? ?? '',
      email: json['email'] as String? ?? '',
      avatarUrl: json['avatarUrl'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'displayName': displayName,
      'email': email,
      'avatarUrl': avatarUrl,
    };
  }

  @override
  List<Object?> get props => [id, username, displayName, email, avatarUrl];
}
