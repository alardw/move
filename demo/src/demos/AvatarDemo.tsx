import { Avatar } from 'move';

export function AvatarDemo() {
  return (
    <div className="demo-section">
      <h3>Avatars</h3>
      <div className="demo-box">
        <div className="avatar-group">
          <Avatar.Root className="avatar-root">
            <Avatar.Image
              className="avatar-image"
              src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
              alt="User"
            />
            <Avatar.Fallback className="avatar-fallback" delayMs={600}>
              JD
            </Avatar.Fallback>
          </Avatar.Root>

          <Avatar.Root className="avatar-root">
            <Avatar.Image
              className="avatar-image"
              src="https://images.unsplash.com/photo-1511485977113-f34c92461ad9?w=128&h=128&fit=crop"
              alt="User"
            />
            <Avatar.Fallback className="avatar-fallback" delayMs={600}>
              AB
            </Avatar.Fallback>
          </Avatar.Root>

          <Avatar.Root className="avatar-root">
            <Avatar.Fallback className="avatar-fallback">MK</Avatar.Fallback>
          </Avatar.Root>

          <Avatar.Root className="avatar-root">
            <Avatar.Fallback className="avatar-fallback">+3</Avatar.Fallback>
          </Avatar.Root>
        </div>
      </div>
    </div>
  );
}
